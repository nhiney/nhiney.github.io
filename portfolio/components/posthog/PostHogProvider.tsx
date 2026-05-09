"use client";

import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHReactProvider } from "posthog-js/react";
import { initPostHog } from "@/lib/posthog";

/** Tracks $pageview on every route change — must be inside Suspense */
function PageView() {
  const pathname = usePathname();
  useEffect(() => {
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);
  return null;
}

/** Wrap the app root with this provider to enable PostHog analytics */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHReactProvider client={posthog}>
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
      {children}
    </PHReactProvider>
  );
}
