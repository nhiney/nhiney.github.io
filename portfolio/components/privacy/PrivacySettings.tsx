"use client";

import { Check, Cookie, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  setAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/analytics-consent";
import { useAnalyticsConsent } from "./useAnalyticsConsent";

type SavedConsent = Exclude<AnalyticsConsent, "pending">;

const COPY = {
  en: {
    title: "Your analytics setting",
    description:
      "Choose whether this browser may send optional usage analytics. Your choice takes effect immediately.",
    legend: "Select an analytics preference",
    grantedTitle: "Allow analytics",
    grantedDescription:
      "Send anonymous-by-default page and interaction data to help improve the site.",
    deniedTitle: "Necessary only",
    deniedDescription:
      "Do not send optional analytics. The site will continue to work normally.",
    currentGranted: "Current choice: analytics allowed.",
    currentDenied: "Current choice: necessary only.",
    currentPending:
      "No choice saved yet. Optional analytics remains off until you choose.",
    storage:
      "This preference is stored in localStorage on this browser. Clearing site data will reset it.",
  },
  vi: {
    title: "Cài đặt dữ liệu phân tích",
    description:
      "Chọn xem trình duyệt này có thể gửi dữ liệu sử dụng không bắt buộc hay không. Thay đổi có hiệu lực ngay.",
    legend: "Chọn tùy chọn dữ liệu phân tích",
    grantedTitle: "Cho phép phân tích",
    grantedDescription:
      "Gửi dữ liệu trang và tương tác mặc định ẩn danh để giúp cải thiện website.",
    deniedTitle: "Chỉ cần thiết",
    deniedDescription:
      "Không gửi dữ liệu phân tích không bắt buộc. Website vẫn hoạt động bình thường.",
    currentGranted: "Lựa chọn hiện tại: cho phép phân tích.",
    currentDenied: "Lựa chọn hiện tại: chỉ cần thiết.",
    currentPending:
      "Bạn chưa lưu lựa chọn. Phân tích không bắt buộc vẫn tắt cho đến khi bạn chọn.",
    storage:
      "Tùy chọn này được lưu trong localStorage của trình duyệt. Xóa dữ liệu website sẽ đặt lại lựa chọn.",
  },
} as const;

export function PrivacySettings() {
  const { language } = useLanguage();
  const consent = useAnalyticsConsent();
  const copy = language === "vi" ? COPY.vi : COPY.en;

  const status =
    consent === "granted"
      ? copy.currentGranted
      : consent === "denied"
        ? copy.currentDenied
        : copy.currentPending;

  const options: Array<{
    value: SavedConsent;
    title: string;
    description: string;
  }> = [
    {
      value: "granted",
      title: copy.grantedTitle,
      description: copy.grantedDescription,
    },
    {
      value: "denied",
      title: copy.deniedTitle,
      description: copy.deniedDescription,
    },
  ];

  return (
    <section
      id="privacy-settings"
      aria-labelledby="privacy-settings-title"
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-primary/20 bg-card/90 shadow-[0_24px_70px_-45px_hsl(var(--primary)/0.55)]"
    >
      <div className="h-1 bg-gradient-to-r from-primary via-cyan-500 to-violet-500" />
      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-3.5">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="privacy-settings-title"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              {copy.title}
            </h2>
            <p
              id="analytics-settings-help"
              className="mt-1.5 text-sm leading-6 text-muted-foreground"
            >
              {copy.description}
            </p>
          </div>
        </div>

        <fieldset
          aria-describedby="analytics-settings-help analytics-settings-status"
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          <legend className="sr-only">{copy.legend}</legend>
          {options.map((option) => {
            const selected = consent === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-[border-color,background-color,box-shadow]",
                  "hover:border-primary/40 hover:bg-primary/[0.035]",
                  selected
                    ? "border-primary/50 bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.08)]"
                    : "border-border/80 bg-background/60"
                )}
              >
                <input
                  type="radio"
                  name="analytics-consent"
                  value={option.value}
                  checked={selected}
                  onChange={() => setAnalyticsConsent(option.value)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <span className="min-w-0 pr-6">
                  <span className="block text-sm font-semibold text-foreground">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                </span>
                {selected ? (
                  <span
                    aria-hidden="true"
                    className="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </label>
            );
          })}
        </fieldset>

        <div className="mt-4 flex flex-col gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <p
            id="analytics-settings-status"
            role="status"
            aria-live="polite"
            className="text-sm font-medium text-foreground"
          >
            {status}
          </p>
          <p className="flex items-start gap-1.5 text-xs leading-5 text-muted-foreground sm:max-w-sm">
            <Cookie aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{copy.storage}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
