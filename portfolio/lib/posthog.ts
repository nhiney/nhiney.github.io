import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function initPostHog() {
  if (typeof window === "undefined" || !KEY || posthog.__loaded) return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // handled manually via PostHogPageView
    persistence: "localStorage",
  });
}

/** Call after a user identifies themselves (e.g. waitlist signup) */
export function identifyUser(email: string, traits?: Record<string, unknown>) {
  posthog.identify(email, { email, ...traits });
}

/** Capture a named event with optional properties */
export function trackEvent(event: string, props?: Record<string, unknown>) {
  posthog.capture(event, props);
}

export { posthog };
