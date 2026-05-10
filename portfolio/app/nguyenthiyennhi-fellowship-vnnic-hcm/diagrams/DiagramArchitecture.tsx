"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Smartphone,
  Zap,
  Shuffle,
  Server,
  Database,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";

type NodeProps = {
  icon:    React.ElementType;
  iconBg:  string;
  title:   string;
  meta:    string;
  variant: "primary" | "success" | "storage" | "warning" | "legacy";
};

const VARIANT_STYLES = {
  primary: "border-blue-500/40 bg-gradient-to-br from-blue-600/10 to-blue-700/5",
  success: "border-emerald-500/40 bg-gradient-to-br from-emerald-600/10 to-emerald-700/5",
  storage: "border-cyan-500/40 bg-gradient-to-br from-cyan-600/10 to-cyan-700/5",
  warning: "border-amber-500/40 bg-gradient-to-br from-amber-600/10 to-amber-700/5",
  legacy:  "border-dashed border-slate-500/40 bg-slate-900/30",
} as const;

function Node({ icon: Icon, iconBg, title, meta, variant }: NodeProps) {
  return (
    <div className={`flex items-start gap-4 rounded-2xl border-2 ${VARIANT_STYLES[variant]} p-5 backdrop-blur`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} shadow-lg`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black tracking-tight text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function LayerHeader({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border/40" />
    </div>
  );
}

function Edge({ label, dashed = false, color = "text-emerald-400" }: { label: string; dashed?: boolean; color?: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <ArrowDown size={20} className={color} />
      <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${color} ${dashed ? "border-dashed border-amber-500/40 bg-amber-500/5" : "border-emerald-500/40 bg-emerald-500/5"}`}>
        {label}
      </span>
    </div>
  );
}

export function DiagramArchitecture() {
  const { t } = useLanguage();

  return (
    <figure className="rounded-3xl border border-border/50 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-950/80 p-8 glass-card">
      {/* Layer 1 — Client */}
      <section>
        <LayerHeader label={t("pages.fellowship.diagrams.arch_l1_title")} />
        <Node
          icon={Smartphone}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
          title={t("pages.fellowship.diagrams.arch_l1_node")}
          meta={t("pages.fellowship.diagrams.arch_l1_meta")}
          variant="primary"
        />
      </section>

      <Edge label={t("pages.fellowship.diagrams.arch_edge_primary")} />

      {/* Layer 2 — Routing (split: Native IPv6 + NAT64 fallback) */}
      <section>
        <LayerHeader label={t("pages.fellowship.diagrams.arch_l2_title")} />
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Node
            icon={Zap}
            iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
            title={t("pages.fellowship.diagrams.arch_l2_node_a")}
            meta={t("pages.fellowship.diagrams.arch_l2_node_a_meta")}
            variant="success"
          />
          <Node
            icon={Shuffle}
            iconBg="bg-gradient-to-br from-amber-500 to-amber-700"
            title={t("pages.fellowship.diagrams.arch_l2_node_b")}
            meta={t("pages.fellowship.diagrams.arch_l2_node_b_meta")}
            variant="warning"
          />
        </div>
      </section>

      <Edge label={t("pages.fellowship.diagrams.arch_edge_primary")} />

      {/* Layer 3 — Backend (API + DB) */}
      <section>
        <LayerHeader label={t("pages.fellowship.diagrams.arch_l3_title")} />
        <div className="grid gap-4 md:grid-cols-2">
          <Node
            icon={Server}
            iconBg="bg-gradient-to-br from-blue-500 to-indigo-700"
            title={t("pages.fellowship.diagrams.arch_l3_node_a")}
            meta={t("pages.fellowship.diagrams.arch_l3_node_a_meta")}
            variant="primary"
          />
          <Node
            icon={Database}
            iconBg="bg-gradient-to-br from-cyan-500 to-cyan-700"
            title={t("pages.fellowship.diagrams.arch_l3_node_b")}
            meta={t("pages.fellowship.diagrams.arch_l3_node_b_meta")}
            variant="storage"
          />
        </div>
      </section>

      <Edge label={t("pages.fellowship.diagrams.arch_edge_fallback")} dashed color="text-amber-400" />

      {/* Layer 4 — Legacy */}
      <section>
        <LayerHeader label={t("pages.fellowship.diagrams.arch_l4_title")} />
        <Node
          icon={AlertTriangle}
          iconBg="bg-gradient-to-br from-slate-500 to-slate-700"
          title={t("pages.fellowship.diagrams.arch_l4_node")}
          meta={t("pages.fellowship.diagrams.arch_l4_meta")}
          variant="legacy"
        />
      </section>

      <figcaption className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        {t("pages.fellowship.diagrams.arch_caption")}
      </figcaption>
    </figure>
  );
}
