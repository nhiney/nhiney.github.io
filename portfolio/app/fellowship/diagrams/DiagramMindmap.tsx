"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Flag, Target, Layers } from "lucide-react";

const BRANCHES = [
  {
    key:    "b1",
    icon:   Flag,
    accent: "from-rose-500 to-rose-600",
    ring:   "ring-rose-500/30",
    text:   "text-rose-400",
    rail:   "bg-gradient-to-b from-rose-500/60 to-transparent",
  },
  {
    key:    "b2",
    icon:   Target,
    accent: "from-amber-500 to-amber-600",
    ring:   "ring-amber-500/30",
    text:   "text-amber-400",
    rail:   "bg-gradient-to-b from-amber-500/60 to-transparent",
  },
  {
    key:    "b3",
    icon:   Layers,
    accent: "from-cyan-500 to-blue-600",
    ring:   "ring-cyan-500/30",
    text:   "text-cyan-300",
    rail:   "bg-gradient-to-b from-cyan-500/60 to-transparent",
  },
] as const;

export function DiagramMindmap() {
  const { t } = useLanguage();

  return (
    <figure className="rounded-3xl border border-border/50 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/80 p-8 glass-card">
      {/* ── Center node ── */}
      <div className="flex flex-col items-center">
        <div className="relative inline-flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 text-center shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] ring-1 ring-blue-400/40">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200/80">
            Core
          </span>
          <span className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
            {t("pages.fellowship.diagrams.mindmap_center")}
          </span>
          <span className="mt-1 font-mono text-xs font-bold text-blue-200">
            {t("pages.fellowship.diagrams.mindmap_center_period")}
          </span>
        </div>

        {/* central trunk */}
        <div className="h-8 w-px bg-gradient-to-b from-blue-400/80 to-transparent" />
      </div>

      {/* ── Horizontal rail with 3 branches ── */}
      <div className="relative mt-1">
        {/* Horizontal connector line (only on md+) */}
        <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-0 hidden h-px bg-gradient-to-r from-transparent via-border/80 to-transparent md:block" />

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {BRANCHES.map(({ key, icon: Icon, accent, ring, text, rail }) => (
            <div key={key} className="flex flex-col items-center">
              {/* Stem from horizontal rail */}
              <div className={`h-6 w-px ${rail}`} />

              {/* Branch header */}
              <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${accent} px-5 py-2.5 shadow-lg ring-1 ${ring}`}>
                <Icon size={14} className="text-white" />
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white">
                  {t(`pages.fellowship.diagrams.mindmap_${key}_title`)}
                </span>
              </div>

              {/* Leaves */}
              <ul className="relative mt-5 w-full max-w-[260px] space-y-2">
                {/* Vertical rail through leaves */}
                <span aria-hidden className="pointer-events-none absolute -top-1 bottom-1 left-3 w-px bg-border/60" />

                {[1, 2, 3].map((n) => (
                  <li key={n} className="relative flex items-center gap-3 rounded-xl border border-border/50 bg-card/70 px-4 py-2.5 backdrop-blur transition-colors hover:border-border">
                    {/* Tick mark on rail */}
                    <span aria-hidden className={`absolute left-3 h-px w-3 ${rail.replace("to-b", "to-r").replace("to-transparent", "to-border/60")}`} />
                    <span className={`relative z-10 inline-flex h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${accent} shadow-[0_0_10px_-2px] ${text}`} />
                    <span className="text-sm font-semibold leading-snug text-foreground">
                      {t(`pages.fellowship.diagrams.mindmap_${key}_l${n}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {t("pages.fellowship.diagrams.mindmap_caption")}
      </figcaption>
    </figure>
  );
}
