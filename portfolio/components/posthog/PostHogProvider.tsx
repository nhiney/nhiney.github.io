"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// posthog-js (~190 KB) is loaded lazily via dynamic import() so it never lands
// in the initial/shared bundle. We init it once the page is idle, and capture
// page views manually. Nothing in the app uses the posthog React context
// (no usePostHog() hook), so the React provider is intentionally dropped.

/** Tracks $pageview on route change — only once PostHog has actually loaded. */
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

    let cancelled = false;
    import("@/lib/posthog").then(({ trackPageView }) => {
      if (!cancelled) {
        trackPageView({ source: "route_change" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, queryString]);
  return null;
}

/** Wrap the app root with this provider to enable (deferred) PostHog analytics */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      import("@/lib/posthog").then(({ initPostHog, trackPageView }) => {
        if (cancelled) return;
        initPostHog();
        trackPageView({ source: "initial_load" });
      });

    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle
      ? window.requestIdleCallback(load, { timeout: 3000 })
      : window.setTimeout(load, 2000);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      {children}
    </>
  );
}
