import type { Metadata } from "next";
import { MuonKiep2DesignPreview } from "@/components/library/MuonKiep2DesignPreview";

export const metadata: Metadata = {
  title: "Ba phương án trình bày — Muôn Kiếp Nhân Sinh — Tập 2",
  description: "Bản demo so sánh ba hướng trình bày của Xưởng phục hồi những vòng lặp.",
  robots: { index: false, follow: false },
};

export default function MuonKiep2DesignPreviewPage() {
  return <MuonKiep2DesignPreview />;
}
