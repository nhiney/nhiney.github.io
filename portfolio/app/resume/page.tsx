import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resume | Yen Nhi",
  description: `CV and resume of ${SITE_CONFIG.fullName} — Software Engineering student specialising in backend systems and security.`,
};

// Place your CV at portfolio/public/cv.pdf  (or update this path)
const CV_PATH = "/CV - Nguyễn Thị Yến Nhi.pdf";

const HIGHLIGHTS = [
  { label: "Specialisation", value: "Backend Systems & Database Security" },
  { label: "Primary Stack", value: "Dart · Laravel · Python · Oracle DB" },
  { label: "Coding Hours", value: "442+ hrs (Wakatime tracked)" },
  { label: "Contributions", value: "186+ GitHub contributions" },
];

export default function ResumePage() {
  return (
    <Container className="pb-32 space-y-20">
      {/* ── Header ── */}
      <Section className="space-y-10 pt-20 text-center">
        <FadeIn className="space-y-6 flex flex-col items-center">
          <Badge
            variant="outline"
            className="px-6 py-2 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-[10px]"
          >
            Credentials
          </Badge>
          <Heading variant="hero" as="h1">
            Resume
          </Heading>
          <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
            My engineering background in a single document — backend systems,
            database architecture, and secure software design.
          </p>

          {/* Download CTA */}
          <a
            href={CV_PATH}
            download
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_hsl(var(--primary))] active:scale-95"
          >
            <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
            Download PDF
          </a>
        </FadeIn>
      </Section>

      {/* ── Quick highlights ── */}
      <Section className="pt-0">
        <FadeIn>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-border/50 bg-card/60 p-6 glass-card"
              >
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* ── PDF Viewer ── */}
      <Section className="pt-0 space-y-6">
        <FadeIn className="flex items-center gap-3">
          <FileText size={18} className="text-primary" />
          <Heading variant="section">Document Preview</Heading>
        </FadeIn>

        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 glass-card">
            {/* Aspect ratio wrapper — A4 ≈ 1:1.414 */}
            <div className="relative w-full" style={{ paddingBottom: "141.4%" }}>
              <iframe
                src={`${CV_PATH}#toolbar=1&navpanes=0&scrollbar=1`}
                className="absolute inset-0 h-full w-full"
                title={`CV — ${SITE_CONFIG.fullName}`}
              />
            </div>

            {/* Fallback overlay (shown only if iframe fails via CSS) */}
            <noscript>
              <div className="flex flex-col items-center justify-center gap-4 p-20 text-center">
                <FileText size={48} className="text-muted-foreground" />
                <p className="text-muted-foreground">
                  PDF preview requires JavaScript. Please download the file directly.
                </p>
                <a
                  href={CV_PATH}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-white"
                >
                  <Download size={14} /> Download PDF
                </a>
              </div>
            </noscript>
          </div>
        </FadeIn>

        {/* Secondary download link below viewer */}
        <FadeIn className="text-center">
          <a
            href={CV_PATH}
            download
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
          >
            <Download size={13} /> Save a copy
          </a>
        </FadeIn>
      </Section>
    </Container>
  );
}
