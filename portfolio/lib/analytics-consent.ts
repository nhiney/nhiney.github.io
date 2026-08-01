export type AnalyticsConsent = "pending" | "granted" | "denied";

export type AnalyticsConsentChangeDetail = {
  consent: AnalyticsConsent;
};

export const ANALYTICS_CONSENT_EVENT = "analytics-consent-change";
export const ANALYTICS_CONSENT_STORAGE_KEY = "nhiney.analytics-consent";

let inMemoryConsent: AnalyticsConsent = "pending";

function isAnalyticsConsent(value: string | null): value is AnalyticsConsent {
  return value === "pending" || value === "granted" || value === "denied";
}

/**
 * Reads the visitor's explicit analytics choice.
 *
 * Browser storage can be unavailable in private or hardened browsing modes, so
 * callers always receive a safe state instead of a storage exception.
 */
export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "pending";

  try {
    const storedConsent = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    inMemoryConsent = isAnalyticsConsent(storedConsent) ? storedConsent : "pending";
  } catch {
    // Keep the last choice made during this page session.
  }

  return inMemoryConsent;
}

/**
 * Persists and broadcasts a consent choice without importing the analytics SDK.
 */
export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  if (!isAnalyticsConsent(consent)) return;

  inMemoryConsent = consent;

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // The in-memory choice still protects the current page when storage fails.
  }

  window.dispatchEvent(
    new CustomEvent<AnalyticsConsentChangeDetail>(ANALYTICS_CONSENT_EVENT, {
      detail: { consent },
    })
  );
}

export function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string | null;
  };
  const browserWindow = window as Window & { doNotTrack?: string | null };
  const dntValues = [nav.doNotTrack, nav.msDoNotTrack, browserWindow.doNotTrack];

  return (
    nav.globalPrivacyControl === true ||
    dntValues.some((value) => value?.trim().toLowerCase() === "1" || value?.trim().toLowerCase() === "yes")
  );
}

export function canUseAnalytics(): boolean {
  return getAnalyticsConsent() === "granted" && !isDoNotTrackEnabled();
}
