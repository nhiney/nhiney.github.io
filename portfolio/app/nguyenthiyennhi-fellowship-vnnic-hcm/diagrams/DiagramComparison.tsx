"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Smartphone,
  AlertTriangle,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type PathConfig = {
  prefix:    "compare_a" | "compare_b";
  tagColor:  string;
  borderTop: string;
  glow:      string;
  icons: {
    user: typeof Smartphone;
    mid:  typeof Smartphone;
    end:  typeof Smartphone;
  };
  iconBg:    { user: string; mid: string; end: string };
  midText:   string;
  midBorder: string;
  arrowColor:string;
};

const PATH_A: PathConfig = {
  prefix:    "compare_a",
  tagColor:  "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  borderTop: "border-t-rose-500/60",
  glow:      "shadow-[0_0_40px_-15px_rgba(244,63,94,0.4)]",
  icons:     { user: Smartphone, mid: AlertTriangle, end: Globe },
  iconBg:    {
    user: "bg-slate-700",
    mid:  "bg-gradient-to-br from-rose-500 to-rose-700",
    end:  "bg-slate-700",
  },
  midText:   "text-rose-300",
  midBorder: "border-rose-500/40",
  arrowColor:"text-rose-500/70",
};

const PATH_B: PathConfig = {
  prefix:    "compare_b",
  tagColor:  "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  borderTop: "border-t-emerald-500/60",
  glow:      "shadow-[0_0_40px_-15px_rgba(16,185,129,0.5)]",
  icons:     { user: Smartphone, mid: Zap, end: Globe },
  iconBg:    {
    user: "bg-slate-700",
    mid:  "bg-gradient-to-br from-emerald-500 to-emerald-700",
    end:  "bg-slate-700",
  },
  midText:   "text-emerald-300",
  midBorder: "border-emerald-500/40",
  arrowColor:"text-emerald-500/80",
};

function PathRow({ cfg }: { cfg: PathConfig }) {
  const { t } = useLanguage();
  const { icons, iconBg } = cfg;

  return (
    <div className={`relative rounded-3xl border border-border/50 ${cfg.borderTop} border-t-2 bg-card/60 p-6 ${cfg.glow}`}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h4 className="text-sm font-black tracking-tight text-foreground">
          {t(`pages.fellowship.diagrams.${cfg.prefix}_title`)}
        </h4>
        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ring-1 ${cfg.tagColor}`}>
          {t(`pages.fellowship.diagrams.${cfg.prefix}_tag`)}
        </span>
      </div>

      {/* Flow row */}
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {/* User node */}
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg.user}`}>
            <icons.user size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black tracking-tight text-foreground">
              {t(`pages.fellowship.diagrams.${cfg.prefix}_user`)}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {t(`pages.fellowship.diagrams.${cfg.prefix}_user_meta`)}
            </p>
          </div>
        </div>

        <ArrowRight size={20} className={`mx-auto rotate-90 md:rotate-0 ${cfg.arrowColor}`} />

        {/* Middle node (the differentiator) */}
        <div className={`flex flex-[1.3] items-center gap-3 rounded-2xl border-2 ${cfg.midBorder} bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-4 ring-2 ring-offset-0 ${cfg.midBorder.replace("border-", "ring-").replace("/40", "/20")}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg.mid} shadow-lg`}>
            <icons.mid size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-black tracking-tight ${cfg.midText}`}>
              {t(`pages.fellowship.diagrams.${cfg.prefix}_mid`)}
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {t(`pages.fellowship.diagrams.${cfg.prefix}_mid_meta`)}
            </p>
          </div>
        </div>

        <ArrowRight size={20} className={`mx-auto rotate-90 md:rotate-0 ${cfg.arrowColor}`} />

        {/* End node */}
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border/50 bg-background/40 p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg.end}`}>
            <icons.end size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black tracking-tight text-foreground">
              {t(`pages.fellowship.diagrams.${cfg.prefix}_end`)}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {t(`pages.fellowship.diagrams.${cfg.prefix}_end_meta`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramComparison() {
  const { t } = useLanguage();

  return (
    <figure className="rounded-3xl border border-border/50 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/80 p-8 glass-card">
      <div className="space-y-5">
        <PathRow cfg={PATH_A} />
        <PathRow cfg={PATH_B} />
      </div>

      {/* Verdict callout */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
        <p className="text-sm font-semibold leading-relaxed text-foreground">
          <span className="text-emerald-400">Verdict — </span>
          {t("pages.fellowship.diagrams.compare_verdict")}
        </p>
      </div>

      <figcaption className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {t("pages.fellowship.diagrams.compare_caption")}
      </figcaption>
    </figure>
  );
}
