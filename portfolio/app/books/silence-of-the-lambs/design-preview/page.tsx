import type { Metadata } from "next";
import { SilenceDesignPreview } from "@/components/library/SilenceDesignPreview";

export const metadata: Metadata = {
  title: "Ba phương án trình bày — Sự Im Lặng Của Bầy Cừu",
  description: "Bản demo so sánh ba hướng trình bày bảng và sơ đồ trong sách.",
  robots: { index: false, follow: false },
};

export default function SilenceDesignPreviewPage() {
  return <SilenceDesignPreview />;
}
