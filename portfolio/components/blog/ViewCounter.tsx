"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Per-post page-view counter for a statically-exported site.
 *
 * Uses Abacus (https://abacus.jasoncameron.dev) — a free, no-auth hit counter.
 * It counts unique readers, not raw loads:
 * - First time a browser opens a post → `hit` (increment) and remember it locally.
 * - Any later visit / reload of that post → `get` only, so it never counts twice.
 * - In a list (readOnly) → always `get`, so listing never inflates the total.
 * The local guard plus a ref guard mean reloads and StrictMode can't double-count.
 */
const NAMESPACE = "startup-id-vn-blog";
const BASE = "https://abacus.jasoncameron.dev";
const SEEN_PREFIX = "viewed:";

function hasSeen(key: string): boolean {
  try {
    return localStorage.getItem(SEEN_PREFIX + key) === "1";
  } catch {
    return false;
  }
}

function markSeen(key: string) {
  try {
    localStorage.setItem(SEEN_PREFIX + key, "1");
  } catch {
    /* private mode / storage disabled — counting just falls back to per-load */
  }
}

interface ViewCounterProps {
  slug: string;
  /** Read the count without incrementing — use this when listing posts. */
  readOnly?: boolean;
  /** Append the word "views" after the number. */
  showLabel?: boolean;
}

export function ViewCounter({ slug, readOnly = false, showLabel = true }: ViewCounterProps) {
  const { t } = useLanguage();
  const [views, setViews] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

    const key = slug.replace(/[^a-zA-Z0-9_-]/g, "-");
    // Only a brand-new reader increments; reloads and return visits just read.
    const isNewReader = !readOnly && !hasSeen(key);
    const endpoint = isNewReader ? "hit" : "get";

    fetch(`${BASE}/${endpoint}/${NAMESPACE}/${key}`)
      .then((res) => {
        if (res.ok) return res.json();
        // A post nobody has opened yet has no counter — treat as zero when reading.
        if (!isNewReader && res.status === 404) return { value: 0 };
        return Promise.reject(res.status);
      })
      .then((data) => {
        if (typeof data?.value === "number") setViews(data.value);
        if (isNewReader) markSeen(key);
      })
      .catch(() => setViews(readOnly ? 0 : null));
  }, [slug, readOnly]);

  return (
    <span className="inline-flex items-center gap-1.5" title="Page views">
      <Eye size={14} className="shrink-0" />
      <span className="tabular-nums">{views === null ? "—" : views.toLocaleString()}</span>
      {showLabel && <span className="text-muted-foreground/50">{t("blogPage.views")}</span>}
    </span>
  );
}
