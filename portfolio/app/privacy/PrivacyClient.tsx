"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Database,
  EyeOff,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PrivacySettings } from "@/components/privacy/PrivacySettings";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";

const COPY = {
  en: {
    back: "Back to home",
    eyebrow: "Privacy & analytics",
    title: "Your visit, your choice",
    intro:
      "This portfolio uses optional PostHog analytics to understand what is useful and improve the experience. Analytics stays off until you choose, and you can change that choice at any time.",
    promise: "No optional analytics before consent",
    dataTitle: "What analytics can collect",
    dataIntro:
      "If you allow analytics, the site may send the following usage information to PostHog:",
    dataItems: [
      "An anonymous visitor and session identifier",
      "Page paths and titles, view or leave times, and navigation paths",
      "Only defined interactions, such as project, call-to-action, outbound-link, and form-status events",
      "A sanitized referring domain and allowlisted source or UTM campaign parameters",
      "Language, time zone, color preference, and coarse device or viewport categories",
      "Core Web Vitals and coarse performance measurements, including metric type, value, rating, and navigation type",
    ],
    dataLimit:
      "The analytics code does not send query strings or URL fragments, raw form text, raw names or email addresses, full user-agent strings, exact screen dimensions, hardware details, or network-quality details. Session replay, automatic DOM capture, rage-click capture, and automatic exception capture are disabled.",
    anonymousTitle: "Anonymous by default",
    anonymousBody:
      "Analytics begins without your name or email. If you voluntarily submit a form on this site, a one-way pseudonymous identifier may link that action without sending the raw name or email. Contacting me through your email app is separate, and inbox content is never read by analytics.",
    purposeTitle: "Why I use it",
    purposeBody:
      "I use aggregate patterns to understand which work people find useful, improve navigation and accessibility, and spot pages that may need attention. I do not use this data for targeted advertising.",
    retentionTitle: "Retention and service provider",
    retentionBody:
      "PostHog processes analytics on my behalf. The retention period is controlled in the PostHog project dashboard and may change as this site evolves. I do not sell analytics data.",
    ingestionBody:
      "Like any hosted analytics endpoint, PostHog necessarily receives the network connection and IP address when an event is ingested. This repository does not add the IP address as an event property. Whether PostHog discards it or uses it for geolocation, and how long any derived data is kept, depends on the PostHog project dashboard settings.",
    deletionBody:
      "You can ask about retention or request deletion by email. Because visits are anonymous by default, I may need the anonymous visitor ID from your browser to locate a specific record.",
    choiceTitle: "How your choice works",
    choiceBody:
      "Your preference is saved in this browser's localStorage. If you allow analytics, PostHog may also store anonymous identifiers there. Nothing follows you to another browser or device, clearing site storage resets the choice, and Global Privacy Control or Do Not Track still overrides an allow choice.",
    contactTitle: "Questions or data requests",
    contactBody:
      "For privacy questions, retention details, or a deletion request, contact me directly.",
    contactAction: "Email about privacy",
    updated: "Last updated: August 1, 2026",
  },
  vi: {
    back: "Về trang chủ",
    eyebrow: "Quyền riêng tư & phân tích",
    title: "Lượt truy cập của bạn, lựa chọn của bạn",
    intro:
      "Portfolio này dùng PostHog không bắt buộc để hiểu nội dung nào hữu ích và cải thiện trải nghiệm. Phân tích được tắt cho đến khi bạn lựa chọn, và bạn có thể thay đổi bất cứ lúc nào.",
    promise: "Không phân tích không bắt buộc trước khi bạn đồng ý",
    dataTitle: "Dữ liệu phân tích có thể thu thập",
    dataIntro:
      "Nếu bạn cho phép phân tích, website có thể gửi các thông tin sử dụng sau đến PostHog:",
    dataItems: [
      "Mã khách truy cập và phiên truy cập ẩn danh",
      "Đường dẫn, tiêu đề trang, thời điểm xem hoặc rời trang và luồng điều hướng",
      "Chỉ các tương tác đã định nghĩa như dự án, nút hành động, liên kết ngoài và trạng thái biểu mẫu",
      "Tên miền giới thiệu đã làm sạch và tham số nguồn hoặc chiến dịch UTM trong danh sách cho phép",
      "Ngôn ngữ, múi giờ, lựa chọn màu và nhóm thiết bị hoặc khung nhìn ở mức khái quát",
      "Core Web Vitals và số đo hiệu năng ở mức khái quát, gồm loại, giá trị, xếp hạng chỉ số và kiểu điều hướng",
    ],
    dataLimit:
      "Mã phân tích không gửi chuỗi truy vấn hoặc phần neo của URL, nội dung nhập trong biểu mẫu, tên hoặc email gốc, chuỗi user-agent đầy đủ, kích thước màn hình chính xác, thông tin phần cứng hay chất lượng mạng. Tính năng phát lại phiên, tự động ghi nhận DOM, rage-click và tự động ghi nhận lỗi đều bị tắt.",
    anonymousTitle: "Mặc định ẩn danh",
    anonymousBody:
      "Phân tích bắt đầu mà không có tên hoặc email của bạn. Nếu bạn chủ động gửi biểu mẫu trên website, một mã giả danh một chiều có thể liên kết hành động đó mà không gửi tên hoặc email gốc. Liên hệ qua ứng dụng email là hành động riêng và nội dung hộp thư không bao giờ bị analytics đọc.",
    purposeTitle: "Mục đích sử dụng",
    purposeBody:
      "Tôi dùng xu hướng tổng hợp để hiểu nội dung nào hữu ích, cải thiện điều hướng và khả năng tiếp cận, đồng thời phát hiện trang cần được chỉnh sửa. Tôi không dùng dữ liệu này cho quảng cáo nhắm mục tiêu.",
    retentionTitle: "Thời gian lưu trữ và nhà cung cấp",
    retentionBody:
      "PostHog xử lý dữ liệu phân tích thay mặt tôi. Thời gian lưu trữ được quản lý trong dashboard dự án PostHog và có thể thay đổi khi website phát triển. Tôi không bán dữ liệu phân tích.",
    ingestionBody:
      "Giống mọi dịch vụ phân tích được lưu trữ, PostHog bắt buộc nhận kết nối mạng và địa chỉ IP khi tiếp nhận một sự kiện. Mã nguồn trong repository này không thêm IP thành thuộc tính sự kiện. Việc PostHog loại bỏ IP hay dùng IP để suy ra vị trí, cùng thời gian lưu dữ liệu phát sinh, phụ thuộc vào cài đặt dashboard của dự án PostHog.",
    deletionBody:
      "Bạn có thể hỏi về thời gian lưu hoặc yêu cầu xóa qua email. Vì lượt truy cập mặc định ẩn danh, tôi có thể cần mã khách truy cập ẩn danh trong trình duyệt để tìm đúng bản ghi.",
    choiceTitle: "Cách lựa chọn được lưu",
    choiceBody:
      "Tùy chọn được lưu trong localStorage của trình duyệt này. Nếu bạn cho phép phân tích, PostHog cũng có thể lưu mã ẩn danh tại đây. Dữ liệu không đi theo bạn sang trình duyệt hoặc thiết bị khác; xóa dữ liệu website sẽ đặt lại lựa chọn; Global Privacy Control hoặc Do Not Track vẫn ưu tiên hơn lựa chọn cho phép.",
    contactTitle: "Câu hỏi hoặc yêu cầu về dữ liệu",
    contactBody:
      "Nếu có câu hỏi về quyền riêng tư, thời gian lưu trữ hoặc muốn yêu cầu xóa dữ liệu, hãy liên hệ trực tiếp với tôi.",
    contactAction: "Gửi email về quyền riêng tư",
    updated: "Cập nhật lần cuối: 01/08/2026",
  },
} as const;

export function PrivacyClient() {
  const { language } = useLanguage();
  const copy = language === "vi" ? COPY.vi : COPY.en;

  const detailCards = [
    {
      title: copy.anonymousTitle,
      body: copy.anonymousBody,
      icon: EyeOff,
    },
    {
      title: copy.purposeTitle,
      body: copy.purposeBody,
      icon: Sparkles,
    },
    {
      title: copy.retentionTitle,
      body: copy.retentionBody,
      icon: Database,
    },
    {
      title: copy.choiceTitle,
      body: copy.choiceBody,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_18%_10%,hsl(var(--primary)/0.12),transparent_36%),radial-gradient(circle_at_82%_4%,hsl(var(--site-accent-2,var(--primary))/0.10),transparent_32%)]"
      />

      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {copy.back}
          </Link>

          <header className="mt-10 max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              {copy.intro}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-2 text-xs font-semibold text-primary">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              {copy.promise}
            </p>
          </header>

          <div className="mt-12 sm:mt-16">
            <PrivacySettings />
          </div>

          <section
            aria-labelledby="analytics-data-title"
            className="mt-8 rounded-2xl border border-border/80 bg-card/70 p-5 sm:p-7"
          >
            <div className="flex items-start gap-3.5">
              <div
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
              >
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="analytics-data-title"
                  className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  {copy.dataTitle}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {copy.dataIntro}
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.dataItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/55 p-4 text-sm leading-6 text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.045] px-4 py-3 text-xs leading-5 text-muted-foreground">
              {copy.dataLimit}
            </p>
          </section>

          <section
            aria-label={copy.eyebrow}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            {detailCards.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-border/80 bg-card/65 p-5 sm:p-6"
              >
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
                {title === copy.retentionTitle ? (
                  <>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {copy.ingestionBody}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {copy.deletionBody}
                    </p>
                  </>
                ) : null}
              </article>
            ))}
          </section>

          <section
            aria-labelledby="privacy-contact-title"
            className="mt-8 flex flex-col gap-5 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <div className="max-w-2xl">
              <h2
                id="privacy-contact-title"
                className="text-xl font-bold tracking-tight text-foreground"
              >
                {copy.contactTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.contactBody}
              </p>
            </div>
            <a
              href={`mailto:${SITE_CONFIG.links.email}?subject=Privacy%20request`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              {copy.contactAction}
            </a>
          </section>

          <p className="mt-8 text-center text-xs text-muted-foreground/75">
            {copy.updated}
          </p>
        </div>
      </Container>
    </div>
  );
}
