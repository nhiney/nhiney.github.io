"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Per-post page-view counter for a statically-exported site.
 *
 * Uses Abacus (https://abacus.jasoncameron.dev) — a free, no-auth hit counter —
 * so the number is a real server-side count, never a hard-coded or random one.
 *
 * What counts as ONE view (the rule, kept deliberately strict so the number is
 * honest rather than inflated):
 *   • a real human browser — bots, crawlers and automation are excluded;
 *   • the post tab was actually visible and stayed open ≥ DWELL_MS — prefetches,
 *     instant bounces and background tabs don't count;
 *   • the first time that browser reads the post — reloads and return visits
 *     only read the count back, never re-increment (localStorage + ref guard);
 *   • not the site owner — visit any post once with `?noview=1` to opt out;
 *   • a post shown in a list (readOnly) is only read, never counted.
 */
const NAMESPACE = "startup-id-vn-blog";
const BASE = "https://abacus.jasoncameron.dev";
const SEEN_PREFIX = "viewed:";
const OWNER_KEY = "abacus-owner";
const DWELL_MS = 3000;

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / storage disabled — degrade gracefully */
  }
}

/** True for headless automation and known crawlers — these must never count. */
function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent.toLowerCase();
  return /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|pagespeed|gtmetrix|facebookexternalhit|whatsapp|telegrambot|embedly|preview|prerender|phantom|puppeteer|playwright/.test(
    ua
  );
}

/** The owner opts out by loading any post once with ?noview=1. */
function isOwner(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("noview") === "1") {
      safeSet(OWNER_KEY, "1");
    }
  } catch {
    /* ignore */
  }
  return safeGet(OWNER_KEY) === "1";
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
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const key = slug.replace(/[^a-zA-Z0-9_-]/g, "-");
    let cancelled = false;

    // 1) Always read the current count first so the number shows immediately.
    fetch(`${BASE}/get/${NAMESPACE}/${key}`)
      .then((res) => (res.ok ? res.json() : res.status === 404 ? { value: 0 } : Promise.reject(res.status)))
      .then((data) => {
        if (!cancelled && typeof data?.value === "number") setViews(data.value);
      })
      .catch(() => {
        if (!cancelled) setViews(readOnly ? 0 : null);
      });

    // 2) Only a brand-new, real, engaged reader of the article increments.
    const eligible = !readOnly && !hasSeen(key) && !isBot() && !isOwner();
    if (!eligible) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let counted = false;

    const hit = () => {
      if (counted || cancelled) return;
      counted = true;
      safeSet(SEEN_PREFIX + key, "1"); // guard before the request so it can't double-fire
      fetch(`${BASE}/hit/${NAMESPACE}/${key}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          if (!cancelled && typeof data?.value === "number") setViews(data.value);
        })
        .catch(() => {
          /* network hiccup — already marked seen, displayed count stays as-is */
        });
    };

    // Count only after the tab has been genuinely visible for DWELL_MS.
    const startDwell = () => {
      if (timer || counted) return;
      if (document.visibilityState === "visible") {
        timer = setTimeout(hit, DWELL_MS);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        startDwell();
      } else if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    startDwell();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slug, readOnly]);

  return (
    <span className="inline-flex items-center gap-1.5" title="Page views">
      <Eye size={14} className="shrink-0" />
      <span className="tabular-nums">{views === null ? "—" : views.toLocaleString()}</span>
      {showLabel && <span className="text-muted-foreground/50">{t("blogPage.views")}</span>}
    </span>
  );
}

function hasSeen(key: string): boolean {
  return safeGet(SEEN_PREFIX + key) === "1";
}
