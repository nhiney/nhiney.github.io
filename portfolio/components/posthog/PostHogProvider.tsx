"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  canUseAnalytics,
  getAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsConsentChangeDetail,
} from "@/lib/analytics-consent";

const EVENT_NAME_PATTERN = /^[a-z0-9][a-z0-9_]{1,63}$/;
const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

function safeText(value: string | undefined, maxLength = 80) {
  if (!value) return undefined;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized ? normalized.slice(0, maxLength) : undefined;
}

function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!canUseAnalytics() || !EVENT_NAME_PATTERN.test(event)) return;

  void import("@/lib/posthog")
    .then(({ trackEvent }) => {
      trackEvent(event, properties);
    })
    .catch(() => {
      // Analytics must never interrupt the visitor experience.
    });
}

async function capturePageView(
  source: "initial_load" | "route_change" | "consent_granted"
) {
  if (!canUseAnalytics()) return false;

  try {
    const { trackPageView } = await import("@/lib/posthog");
    return trackPageView({ source });
  } catch {
    // Analytics must never interrupt navigation.
    return false;
  }
}

function getSafeLinkContext(anchor: HTMLAnchorElement) {
  const rawHref = anchor.getAttribute("href")?.trim();
  if (!rawHref) return {};

  if (rawHref.startsWith("#")) {
    return {
      link_kind: "page_section",
      destination_path: window.location.pathname,
      destination_section: safeText(rawHref.slice(1), 64),
    };
  }

  if (rawHref.startsWith("mailto:")) {
    return { link_kind: "email" };
  }

  if (rawHref.startsWith("tel:")) {
    return { link_kind: "phone" };
  }

  try {
    const destination = new URL(rawHref, window.location.origin);
    if (!["http:", "https:"].includes(destination.protocol)) return {};

    const isInternal = destination.origin === window.location.origin;
    const destinationPath = destination.pathname || "/";
    const isDownload =
      anchor.hasAttribute("download") ||
      /\.(?:pdf|docx?|xlsx?|pptx?|zip)$/i.test(destinationPath);

    return {
      link_kind: isDownload ? "download" : isInternal ? "internal" : "outbound",
      destination_path: isInternal ? destinationPath : undefined,
      destination_domain: isInternal ? undefined : destination.hostname,
      opens_new_tab: anchor.target === "_blank",
    };
  } catch {
    return {};
  }
}

function inferLinkEvent(properties: Record<string, unknown>) {
  switch (properties.link_kind) {
    case "email":
    case "phone":
      return "contact_channel_clicked";
    case "download":
      return "file_downloaded";
    case "outbound":
      return "outbound_link_clicked";
    case "page_section":
      return "page_section_clicked";
    default:
      return "internal_link_clicked";
  }
}

function InteractionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const explicitTarget = event.target.closest<HTMLElement>("[data-analytics-event]");
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      const explicitEvent = explicitTarget?.dataset.analyticsEvent;
      const label = safeText(explicitTarget?.dataset.analyticsLabel);
      const linkContext = anchor ? getSafeLinkContext(anchor) : {};

      if (explicitEvent && EVENT_NAME_PATTERN.test(explicitEvent)) {
        captureEvent(explicitEvent, {
          analytics_label: label,
          ...linkContext,
        });
        return;
      }

      if (anchor && Object.keys(linkContext).length > 0) {
        captureEvent(inferLinkEvent(linkContext), linkContext);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const sent = new Set<number>();

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !sent.has(milestone) && canUseAnalytics()) {
          sent.add(milestone);
          captureEvent("scroll_depth_reached", { percent: milestone });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, queryString]);

  return null;
}

function PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    void capturePageView("route_change");
  }, [pathname, queryString]);

  return null;
}

function WebVitals() {
  useReportWebVitals((metric) => {
    captureEvent("web_vital_reported", {
      metric_id: metric.id,
      metric_type: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      navigation_type: metric.navigationType,
    });
  });

  return null;
}

/** Enables privacy-gated PostHog analytics across the static App Router site. */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const loadPromise = useRef<Promise<void> | null>(null);
  const currentConsent = useRef(getAnalyticsConsent());
  const initialPageViewSent = useRef(false);
  const pageViewAttempt = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;
    let pageViewRetryCount = 0;
    currentConsent.current = getAnalyticsConsent();

    const startAnalytics = (source: "initial_load" | "consent_granted") => {
      if (!canUseAnalytics()) return;

      if (!loadPromise.current) {
        loadPromise.current = import("@/lib/posthog")
          .then(({ initPostHog }) => {
            if (!cancelled) initPostHog();
          })
          .catch(() => {
            loadPromise.current = null;
          });
      }

      if (!initialPageViewSent.current) {
        const attempt = ++pageViewAttempt.current;
        initialPageViewSent.current = true;
        void capturePageView(source).then((accepted) => {
          if (accepted) {
            pageViewRetryCount = 0;
          } else if (pageViewAttempt.current === attempt) {
            initialPageViewSent.current = false;
            if (pageViewRetryCount < 1) {
              pageViewRetryCount += 1;
              retryTimer = window.setTimeout(() => {
                retryTimer = undefined;
                startAnalytics(source);
              }, 1500);
            }
          }
        });
      }
    };

    const applyConsent = (nextConsent: AnalyticsConsent) => {
      const previousConsent = currentConsent.current;
      currentConsent.current = nextConsent;

      if (nextConsent === "granted") {
        startAnalytics("consent_granted");
        return;
      }

      if (previousConsent === "granted") {
        pageViewAttempt.current += 1;
        if (retryTimer !== undefined) {
          window.clearTimeout(retryTimer);
          retryTimer = undefined;
        }
        pageViewRetryCount = 0;
        loadPromise.current = null;
        initialPageViewSent.current = false;
        void import("@/lib/posthog")
          .then(({ revokePostHogConsent }) => {
            revokePostHogConsent();
          })
          .catch(() => {
            // Revocation is also enforced by canUseAnalytics() before every capture.
          });
      }
    };

    const onConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<AnalyticsConsentChangeDetail>;
      const nextConsent = customEvent.detail?.consent;
      if (nextConsent) applyConsent(nextConsent);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === ANALYTICS_CONSENT_STORAGE_KEY || event.key === null) {
        applyConsent(getAnalyticsConsent());
      }
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
    window.addEventListener("storage", onStorage);
    if (canUseAnalytics()) startAnalytics("initial_load");

    return () => {
      cancelled = true;
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
      window.removeEventListener("storage", onStorage);
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageView />
        <InteractionTracker />
      </Suspense>
      <WebVitals />
      {children}
    </>
  );
}
