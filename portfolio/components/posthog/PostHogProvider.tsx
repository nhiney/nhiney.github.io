"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// posthog-js (~190 KB) is loaded lazily via dynamic import() so it never lands
// in the initial/shared bundle. We init it once the page is idle, and capture
// page views manually. Nothing in the app uses the posthog React context
// (no usePostHog() hook), so the React provider is intentionally dropped.

/** Tracks $pageview on route change — only once PostHog has actually loaded. */
function PageView() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    import("@/lib/posthog").then(({ posthog }) => {
      if (!cancelled && posthog.__loaded) {
        posthog.capture("$pageview", { $current_url: window.location.href });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  return null;
}

/** Wrap the app root with this provider to enable (deferred) PostHog analytics */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      import("@/lib/posthog").then(({ initPostHog, posthog }) => {
        if (cancelled) return;
        initPostHog();
        // Capture the first page view here, since PageView's effect ran before
        // PostHog finished loading.
        if (posthog.__loaded) {
          posthog.capture("$pageview", { $current_url: window.location.href });
        }
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
      <PageView />
      {children}
    </>
  );
}
