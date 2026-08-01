import posthog, { type CaptureResult, type Properties } from "posthog-js";
import { canUseAnalytics, setAnalyticsConsent } from "./analytics-consent";

export {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "./analytics-consent";

const KEY = (process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "").trim();
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
const MARKETING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "ref",
  "source",
  "campaign",
] as const;
const FINGERPRINT_PROPERTY_PATTERN =
  /(^|[_$-])(raw_user_agent|user_agent|browser_version|os_version|device_memory|hardware_concurrency|cpu_cores|touch_points|pixel_ratio|color_depth|screen_(?:width|height|available_width|available_height)|viewport_(?:width|height)|network|connection|downlink|rtt)([_$-]|$)/i;
const SENSITIVE_PROPERTY_PATTERN =
  /(^|[_$-])(e_?mail|email|phone|telephone|mobile|first_?name|last_?name|full_?name|name|address|street|postal|zip|message|comment|notes?|password|secret|authorization|access_?token|query|search)([_$-]|$)/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const URL_PATTERN = /^https?:\/\//i;
const EMBEDDED_URL_PATTERN = /https?:\/\/\S+/i;
const SAFE_EVENT_NAME_PATTERN = /^[A-Za-z0-9_$][A-Za-z0-9_$ .:/-]{0,79}$/;

let ready = false;
let consentRevision = 0;
let initialVisitorPropertiesRegistered = false;
const pending: Array<() => void> = [];

type NavigatorWithClientHints = Navigator & {
  userAgentData?: {
    mobile?: boolean;
  };
};

export function isPostHogConfigured() {
  return Boolean(KEY);
}

function compact(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

function truncate(value: string, maxLength = 160) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function isLikelyPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 && /^[+\d().\s-]+$/.test(value);
}

function containsDirectPii(value: string) {
  return EMAIL_PATTERN.test(value) || isLikelyPhoneNumber(value);
}

function getHostname(url?: string) {
  if (!url) return undefined;

  try {
    return new URL(url, typeof window === "undefined" ? "https://local.invalid" : window.location.origin).hostname;
  } catch {
    return undefined;
  }
}

function sanitizePath(value?: string) {
  if (!value) return "/";

  let pathname = value;
  try {
    pathname = new URL(value, typeof window === "undefined" ? "https://local.invalid" : window.location.origin).pathname;
  } catch {
    pathname = value.split(/[?#]/, 1)[0] ?? "/";
  }

  const safeSegments = pathname.split("/").map((segment) => {
    if (!segment) return segment;

    let decodedSegment = segment;
    try {
      decodedSegment = decodeURIComponent(segment);
    } catch {
      // Keep the original segment if it is not valid percent-encoded text.
    }

    if (containsDirectPii(decodedSegment) || decodedSegment.length > 64) {
      return "[redacted]";
    }

    return truncate(decodedSegment, 64);
  });

  const safePath = safeSegments.join("/").split(/[?#]/, 1)[0] || "/";
  return truncate(safePath.startsWith("/") ? safePath : `/${safePath}`);
}

function sanitizeMarketingValue(value: string) {
  const normalized = value.trim();
  if (!normalized || containsDirectPii(normalized) || EMBEDDED_URL_PATTERN.test(normalized)) {
    return undefined;
  }

  return truncate(normalized, 100);
}

function sanitizePropertyValue(key: string, value: unknown, depth = 0): unknown {
  if (value === undefined || value === null) return undefined;
  if (depth > 2) return undefined;

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized || containsDirectPii(normalized)) return undefined;

    if (
      key === "$current_url" ||
      key === "$pathname" ||
      key === "page_path" ||
      key === "initial_page_path" ||
      key === "first_page_path" ||
      key === "last_page_path"
    ) {
      return sanitizePath(normalized);
    }

    if (
      key === "$referrer" ||
      key === "$initial_referrer" ||
      key === "referrer_url" ||
      key === "initial_referrer_url"
    ) {
      return getHostname(normalized);
    }

    if (URL_PATTERN.test(normalized)) {
      return getHostname(normalized);
    }

    if (EMBEDDED_URL_PATTERN.test(normalized)) return undefined;
    return truncate(normalized);
  }

  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return value
      .slice(0, 20)
      .map((item) => sanitizePropertyValue(key, item, depth + 1))
      .filter((item) => item !== undefined);
  }

  if (typeof value === "object") {
    return sanitizeProperties(value as Record<string, unknown>, depth + 1);
  }

  return undefined;
}

function sanitizeProperties(properties: Record<string, unknown>, depth = 0): Properties {
  const sanitized: Properties = {};

  Object.entries(properties).forEach(([key, value]) => {
    if (
      key === "$ip" ||
      key === "page_url" ||
      key === "initial_page_url" ||
      FINGERPRINT_PROPERTY_PATTERN.test(key) ||
      SENSITIVE_PROPERTY_PATTERN.test(key)
    ) {
      return;
    }

    const safeValue = sanitizePropertyValue(key, value, depth);
    if (safeValue !== undefined) sanitized[key] = safeValue;
  });

  return sanitized;
}

function sanitizeBeforeSend(event: CaptureResult | null): CaptureResult | null {
  if (!event || !canUseAnalytics()) return null;

  event.properties = sanitizeProperties(event.properties);
  if (event.$set) event.$set = sanitizeProperties(event.$set);
  if (event.$set_once) event.$set_once = sanitizeProperties(event.$set_once);

  return event;
}

function getMarketingParams(prefix = "") {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const properties: Record<string, unknown> = {};

  MARKETING_PARAMS.forEach((key) => {
    const value = params.get(key);
    const safeValue = value ? sanitizeMarketingValue(value) : undefined;
    if (safeValue) properties[`${prefix}${key}`] = safeValue;
  });

  return properties;
}

function inferDeviceType(nav: NavigatorWithClientHints) {
  if (nav.userAgentData?.mobile) return "mobile";

  const userAgent = nav.userAgent.toLowerCase();
  const isTablet =
    /ipad|tablet/.test(userAgent) ||
    (nav.maxTouchPoints > 1 && /macintosh/.test(userAgent));

  if (isTablet) return "tablet";
  if (/mobi|android|iphone|ipod/.test(userAgent)) return "mobile";
  return "desktop";
}

function inferViewportBucket(width: number) {
  if (width < 640) return "small";
  if (width < 1024) return "medium";
  return "large";
}

function inferTrafficSource() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const explicitSource = params.get("utm_source") ?? params.get("source") ?? params.get("ref");
  const safeExplicitSource = explicitSource ? sanitizeMarketingValue(explicitSource) : undefined;
  if (safeExplicitSource) return safeExplicitSource;

  const referrerDomain = getHostname(document.referrer);
  if (!referrerDomain) return "direct";
  if (referrerDomain === window.location.hostname) return "internal";
  return referrerDomain;
}

function getVisitorEventProperties() {
  if (typeof window === "undefined") return {};

  const nav = navigator as NavigatorWithClientHints;
  const referrerDomain = getHostname(document.referrer);
  const pageTitle = sanitizePropertyValue("page_title", document.title);

  return compact({
    page_path: sanitizePath(window.location.pathname),
    page_title: pageTitle,
    referrer_domain: referrerDomain,
    traffic_source: inferTrafficSource(),
    ...getMarketingParams(),
    browser_language: nav.language?.split("-", 1)[0]?.toLowerCase(),
    device_type: inferDeviceType(nav),
    viewport_bucket: inferViewportBucket(window.innerWidth),
  });
}

function getVisitorPersonProperties(traits: Record<string, unknown>) {
  const now = new Date().toISOString();
  const context = getVisitorEventProperties();

  return compact({
    ...sanitizeProperties(traits),
    last_seen_at: now,
    last_identified_at: now,
    last_page_path: context.page_path,
    last_page_title: context.page_title,
    last_referrer_domain: context.referrer_domain,
    last_traffic_source: context.traffic_source,
    last_device_type: context.device_type,
    last_browser_language: context.browser_language,
  });
}

function getVisitorPersonPropertiesOnce(source?: unknown) {
  const now = new Date().toISOString();
  const context = getVisitorEventProperties();

  return compact({
    first_seen_at: now,
    first_identified_at: now,
    first_identified_source:
      typeof source === "string" ? sanitizePropertyValue("source", source) : undefined,
    first_page_path: context.page_path,
    first_referrer_domain: context.referrer_domain,
    first_traffic_source: context.traffic_source,
  });
}

function withVisitorContext(props?: Record<string, unknown>) {
  return compact({
    ...getVisitorEventProperties(),
    ...sanitizeProperties(props ?? {}),
  });
}

function clearPending() {
  pending.length = 0;
}

function flushPending() {
  ready = true;
  while (pending.length > 0 && canUseAnalytics()) {
    pending.shift()?.();
  }
  if (!canUseAnalytics()) clearPending();
}

function registerInitialVisitorProperties() {
  if (
    typeof window === "undefined" ||
    !KEY ||
    initialVisitorPropertiesRegistered ||
    !canUseAnalytics()
  ) {
    return;
  }

  const referrerDomain = getHostname(document.referrer);

  posthog.register_once(
    compact({
      initial_seen_at: new Date().toISOString(),
      initial_page_path: sanitizePath(window.location.pathname),
      initial_referrer_domain: referrerDomain,
      initial_traffic_source: inferTrafficSource(),
      ...getMarketingParams("initial_"),
    })
  );
  initialVisitorPropertiesRegistered = true;
}

function optInLoadedPostHog() {
  if (!posthog.__loaded || !canUseAnalytics()) return false;

  posthog.opt_in_capturing({ captureEventName: false });
  if (!posthog.is_capturing()) return false;

  registerInitialVisitorProperties();
  ready = true;
  return true;
}

/**
 * Initializes analytics only after explicit consent. Repeated calls are safe,
 * including after a denial followed by another grant in the same page.
 */
export function initPostHog() {
  if (typeof window === "undefined" || !KEY || !canUseAnalytics()) return false;

  if (posthog.__loaded) {
    return optInLoadedPostHog();
  }

  const initializationRevision = consentRevision;

  try {
    posthog.init(KEY, {
      api_host: HOST,
      person_profiles: "identified_only",
      persistence: "localStorage",
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      rageclick: false,
      capture_dead_clicks: false,
      capture_exceptions: false,
      capture_heatmaps: false,
      capture_performance: false,
      disable_session_recording: true,
      enable_recording_console_log: false,
      disable_surveys: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      advanced_disable_feature_flags: true,
      save_referrer: false,
      save_campaign_params: false,
      mask_personal_data_properties: true,
      custom_personal_data_properties: ["email", "phone", "name", "address"],
      opt_out_capturing_by_default: true,
      opt_out_persistence_by_default: true,
      opt_out_capturing_persistence_type: "localStorage",
      consent_persistence_name: "nhiney-posthog-consent",
      respect_dnt: true,
      before_send: sanitizeBeforeSend,
      loaded: () => {
        if (initializationRevision !== consentRevision || !canUseAnalytics()) {
          ready = false;
          clearPending();
          if (posthog.__loaded) {
            posthog.reset(true);
            posthog.opt_out_capturing();
          }
          return;
        }

        if (optInLoadedPostHog()) {
          flushPending();
        } else {
          ready = false;
          clearPending();
        }
      },
    });
  } catch {
    ready = false;
    clearPending();
    return false;
  }

  return true;
}

/**
 * Applies the current lightweight consent state to an already imported SDK.
 */
export function syncPostHogConsent() {
  if (canUseAnalytics()) return initPostHog();
  revokePostHogConsent();
  return false;
}

/**
 * Stops capture, clears queued work and rotates locally persisted identifiers.
 * This helper does not write the app-level consent choice.
 */
export function revokePostHogConsent() {
  consentRevision += 1;
  ready = false;
  initialVisitorPropertiesRegistered = false;
  clearPending();

  if (typeof window === "undefined" || !posthog.__loaded) return;

  try {
    posthog.reset(true);
    posthog.opt_out_capturing();
  } catch {
    // Revocation must remain a safe no-op if an SDK extension is unavailable.
  }
}

export function grantAnalyticsConsent() {
  setAnalyticsConsent("granted");
  return syncPostHogConsent();
}

export function denyAnalyticsConsent() {
  setAnalyticsConsent("denied");
  revokePostHogConsent();
}

export function resetAnalyticsConsent() {
  setAnalyticsConsent("pending");
  revokePostHogConsent();
}

function withPostHog(action: () => void) {
  if (typeof window === "undefined" || !KEY || !canUseAnalytics()) return false;
  if (!initPostHog()) return false;

  if (ready && posthog.__loaded && posthog.is_capturing()) {
    action();
  } else {
    pending.push(action);
  }

  return true;
}

export function trackPageView(props?: Record<string, unknown>) {
  return withPostHog(() => {
    posthog.capture("$pageview", {
      ...withVisitorContext(props),
      $current_url: sanitizePath(window.location.pathname),
    });
  });
}

async function getPseudonymousContactId(email: string) {
  if (!globalThis.crypto?.subtle) return undefined;

  const value = new TextEncoder().encode(`nhiney-contact:${email}`);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", value);
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `contact_${hash.slice(0, 32)}`;
}

/**
 * Identifies a voluntarily submitted contact without sending raw email/name
 * values to analytics.
 */
export function identifyUser(email: string, traits?: Record<string, unknown>) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) return;

  withPostHog(() => {
    void getPseudonymousContactId(normalizedEmail).then((contactId) => {
      if (!contactId || !canUseAnalytics() || !posthog.is_capturing()) return;

      const safeTraits: Record<string, unknown> = {
        ...(traits ?? {}),
        contact_email_provided: true,
        contact_name_provided: typeof traits?.name === "string" && traits.name.trim().length > 0,
      };

      posthog.identify(
        contactId,
        getVisitorPersonProperties(safeTraits),
        getVisitorPersonPropertiesOnce(safeTraits.source)
      );
    });
  });
}

/** Capture a named event with optional privacy-filtered properties. */
export function trackEvent(event: string, props?: Record<string, unknown>) {
  const eventName = event.trim();
  if (
    !SAFE_EVENT_NAME_PATTERN.test(eventName) ||
    containsDirectPii(eventName) ||
    EMBEDDED_URL_PATTERN.test(eventName)
  ) {
    return;
  }

  withPostHog(() => {
    posthog.capture(eventName, withVisitorContext(props));
  });
}

export { posthog };
