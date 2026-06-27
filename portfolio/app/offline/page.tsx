import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Offline",
  description: "Trang dự phòng khi bạn đang không có kết nối mạng.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <Container className="py-24 sm:py-32">
      <section className="mx-auto flex min-h-[50vh] max-w-2xl flex-col justify-center">
        <p className="book-kicker mb-5">Offline mode</p>
        <h1 className="book-title text-4xl sm:text-5xl">
          Bạn đang offline
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 site-body">
          Những bài viết đã được lưu vẫn có thể mở lại từ trang Blog. Khi có mạng,
          trang sẽ tự cập nhật phiên bản mới nhất cho lần đọc sau.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/blog/"
            className="rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            Mở Blog
          </Link>
          <Link
            href="/"
            className="rounded-md border border-border/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Về trang chủ
          </Link>
        </div>
      </section>
    </Container>
  );
}
