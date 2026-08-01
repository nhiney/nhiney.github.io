"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { setAnalyticsConsent } from "@/lib/analytics-consent";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

const COPY = {
  en: {
    regionLabel: "Analytics consent",
    eyebrow: "Optional analytics",
    title: "Help make this portfolio more useful",
    description:
      "With your permission, anonymous-by-default PostHog analytics show which pages and interactions are helpful. I do not sell this data.",
    note: "Analytics stays off until you choose.",
    accept: "Accept analytics",
    necessary: "Necessary only",
    privacy: "Privacy details",
  },
  vi: {
    regionLabel: "Lựa chọn dữ liệu phân tích",
    eyebrow: "Phân tích không bắt buộc",
    title: "Giúp tôi cải thiện portfolio này",
    description:
      "Nếu bạn đồng ý, PostHog sẽ ghi nhận dữ liệu phân tích mặc định ẩn danh để cho biết trang và tương tác nào hữu ích. Tôi không bán dữ liệu này.",
    note: "Phân tích được tắt cho đến khi bạn lựa chọn.",
    accept: "Cho phép phân tích",
    necessary: "Chỉ cần thiết",
    privacy: "Chi tiết quyền riêng tư",
  },
} as const;

export function AnalyticsConsentBanner() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const consent = useAnalyticsConsent();
  const copy = language === "vi" ? COPY.vi : COPY.en;

  // The privacy route already presents the complete consent control, so a
  // second fixed prompt there would obscure the information the visitor chose
  // to read.
  if (consent !== "pending" || pathname?.startsWith("/privacy")) return null;

  return (
    <aside
      role="region"
      aria-label={copy.regionLabel}
      aria-labelledby="analytics-consent-title"
      aria-describedby="analytics-consent-description analytics-consent-note"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-[0_24px_80px_-24px_hsl(var(--foreground)/0.32)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/85">
        <div className="h-1 bg-gradient-to-r from-primary via-cyan-500 to-violet-500" />
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              aria-hidden="true"
              className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary sm:flex"
            >
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </p>
              <h2
                id="analytics-consent-title"
                className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
              >
                {copy.title}
              </h2>
              <p
                id="analytics-consent-description"
                className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground"
              >
                {copy.description}
              </p>
              <p
                id="analytics-consent-note"
                className="mt-2 text-xs font-medium text-foreground/75"
              >
                {copy.note}{" "}
                <Link
                  href="/privacy"
                  className="rounded-sm text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {copy.privacy}
                </Link>
              </p>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-auto">
            <button
              type="button"
              onClick={() => setAnalyticsConsent("granted")}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-[transform,background-color,box-shadow] hover:bg-primary/90 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {copy.accept}
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsConsent("denied")}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-[transform,border-color,background-color] hover:border-primary/40 hover:bg-secondary/70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {copy.necessary}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
