import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const MARKETING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "ref",
  "referrer",
  "source",
  "campaign",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

let ready = false;
const pending: Array<() => void> = [];

type NetworkInformationLike = {
  type?: string;
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
};

type NavigatorWithClientHints = Navigator & {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
  deviceMemory?: number;
  userAgentData?: {
    brands?: Array<{ brand: string; version: string }>;
    mobile?: boolean;
    platform?: string;
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

function truncate(value: string, maxLength = 240) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function getHostname(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

function getMarketingParams(prefix = "") {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const properties: Record<string, unknown> = {};

  MARKETING_PARAMS.forEach((key) => {
    const value = params.get(key);
    if (value) properties[`${prefix}${key}`] = truncate(value);
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

function inferTrafficSource() {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const explicitSource = params.get("utm_source") ?? params.get("source") ?? params.get("ref");
  if (explicitSource) return truncate(explicitSource);

  const referrerDomain = getHostname(document.referrer);
  if (!referrerDomain) return "direct";
  if (referrerDomain === window.location.hostname) return "internal";
  return referrerDomain;
}

function getVisitorEventProperties() {
  if (typeof window === "undefined") return {};

  const nav = navigator as NavigatorWithClientHints;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  const referrer = document.referrer || undefined;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgentBrands = nav.userAgentData?.brands
    ?.map((brand) => `${brand.brand} ${brand.version}`)
    .join(", ");

  return compact({
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer_url: referrer,
    referrer_domain: getHostname(referrer),
    traffic_source: inferTrafficSource(),
    ...getMarketingParams(),

    browser_language: nav.language,
    browser_languages: nav.languages?.join(","),
    browser_user_agent: nav.userAgent,
    browser_user_agent_brands: userAgentBrands,
    visitor_timezone: timeZone,
    visitor_timezone_offset_minutes: new Date().getTimezoneOffset(),
    visitor_local_hour: new Date().getHours(),

    device_type: inferDeviceType(nav),
    device_platform: nav.userAgentData?.platform ?? nav.platform,
    device_vendor: nav.vendor,
    device_memory_gb: nav.deviceMemory,
    device_cpu_cores: nav.hardwareConcurrency,
    device_touch_points: nav.maxTouchPoints,
    device_is_mobile: nav.userAgentData?.mobile,

    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    screen_available_width: window.screen.availWidth,
    screen_available_height: window.screen.availHeight,
    screen_pixel_ratio: window.devicePixelRatio,
    screen_color_depth: window.screen.colorDepth,
    prefers_color_scheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",

    network_type: connection?.type,
    network_effective_type: connection?.effectiveType,
    network_save_data: connection?.saveData,
    network_downlink_mbps: connection?.downlink,
    network_rtt_ms: connection?.rtt,
  });
}

function getVisitorPersonProperties(traits: Record<string, unknown>) {
  const now = new Date().toISOString();
  const context = getVisitorEventProperties();

  return compact({
    ...traits,
    last_seen_at: now,
    last_identified_at: now,
    last_page_path: context.page_path,
    last_page_title: context.page_title,
    last_referrer_domain: context.referrer_domain,
    last_traffic_source: context.traffic_source,
    last_device_type: context.device_type,
    last_device_platform: context.device_platform,
    last_browser_language: context.browser_language,
    last_timezone: context.visitor_timezone,
  });
}

function getVisitorPersonPropertiesOnce(source?: unknown) {
  const now = new Date().toISOString();
  const context = getVisitorEventProperties();

  return compact({
    first_seen_at: now,
    first_identified_at: now,
    first_identified_source: typeof source === "string" ? source : undefined,
    first_page_path: context.page_path,
    first_referrer_domain: context.referrer_domain,
    first_traffic_source: context.traffic_source,
  });
}

function withVisitorContext(props?: Record<string, unknown>) {
  return compact({
    ...getVisitorEventProperties(),
    ...props,
  });
}

function flushPending() {
  ready = true;
  while (pending.length > 0) {
    pending.shift()?.();
  }
}

function registerInitialVisitorProperties() {
  if (typeof window === "undefined" || !KEY) return;

  const referrer = document.referrer || undefined;

  posthog.register_once(
    compact({
      initial_seen_at: new Date().toISOString(),
      initial_page_url: window.location.href,
      initial_page_path: window.location.pathname,
      initial_referrer_url: referrer,
      initial_referrer_domain: getHostname(referrer),
      initial_traffic_source: inferTrafficSource(),
      ...getMarketingParams("initial_"),
    })
  );
}

export function initPostHog() {
  if (typeof window === "undefined" || !KEY || posthog.__loaded) return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // handled manually via PostHogPageView
    persistence: "localStorage",
    loaded: () => {
      try {
        registerInitialVisitorProperties();
      } finally {
        flushPending();
      }
    },
  });
}

function withPostHog(action: () => void) {
  if (typeof window === "undefined" || !KEY) return false;
  initPostHog();
  if (ready || posthog.__loaded) {
    action();
  } else {
    pending.push(action);
  }
  return true;
}

export function trackPageView(props?: Record<string, unknown>) {
  withPostHog(() => {
    posthog.capture("$pageview", withVisitorContext({ $current_url: window.location.href, ...props }));
  });
}

/** Call after a user identifies themselves (e.g. waitlist signup) */
export function identifyUser(email: string, traits?: Record<string, unknown>) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  withPostHog(() => {
    const userTraits: Record<string, unknown> = {
      ...(traits ?? {}),
      email: normalizedEmail,
    };

    posthog.identify(
      normalizedEmail,
      getVisitorPersonProperties(userTraits),
      getVisitorPersonPropertiesOnce(userTraits.source)
    );
  });
}

/** Capture a named event with optional properties */
export function trackEvent(event: string, props?: Record<string, unknown>) {
  withPostHog(() => {
    posthog.capture(event, withVisitorContext(props));
  });
}

export { posthog };
