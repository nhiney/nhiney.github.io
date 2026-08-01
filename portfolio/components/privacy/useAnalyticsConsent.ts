"use client";

import { useSyncExternalStore } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  getAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CONSENT_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): AnalyticsConsent {
  return "pending";
}

/**
 * Keeps every consent control in sync without reading localStorage during
 * server rendering. This avoids hydration mismatches in the static export.
 */
export function useAnalyticsConsent() {
  return useSyncExternalStore(
    subscribe,
    getAnalyticsConsent,
    getServerSnapshot
  );
}
