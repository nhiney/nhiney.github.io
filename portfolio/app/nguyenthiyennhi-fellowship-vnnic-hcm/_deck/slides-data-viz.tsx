"use client";

import { motion } from "framer-motion";
import {
  Eyebrow,
  HeadlineDisplay,
  PullQuote,
  Slide,
  itemVariants,
} from "./shared";
import { useDeckT } from "./use-deck-t";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toRad = (deg: number) => (deg * Math.PI) / 180;

// ─── Ecosystem Hub ────────────────────────────────────────────────────────────

const HUB_ANGLES = [-90, -30, 30, 90, 150, 210] as const;

export function SlideEcosystemHub({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_ecosystem_hub;
  const cx = 200, cy = 155, r = 108;

  return (
    <Slide index={index}>
      <Eyebrow index={4} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_200px] lg:items-center">
        {/* SVG hub diagram */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/20 p-4"
        >
          <svg viewBox="0 0 400 310" className="w-full" aria-label="IPv6 ecosystem hub diagram">
            {/* Orbital dashed ring */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity={0.12}
              strokeWidth={1}
              strokeDasharray="4 4"
            />

            {/* Spokes — animated */}
            {HUB_ANGLES.map((deg, i) => {
              const nx = cx + r * Math.cos(toRad(deg));
              const ny = cy + r * Math.sin(toRad(deg));
              return (
                <motion.path
                  key={i}
                  d={`M${cx},${cy} L${nx.toFixed(1)},${ny.toFixed(1)}`}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeOpacity={0.22}
                  strokeWidth={1.5}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.45 + i * 0.1, duration: 0.45, ease: "easeOut" }}
                />
              );
            })}

            {/* Satellite nodes */}
            {s.nodes.map((node, i) => {
              const deg = HUB_ANGLES[i];
              const nx = cx + r * Math.cos(toRad(deg));
              const ny = cy + r * Math.sin(toRad(deg));
              const lines = node.label.split("\n");
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.55 + i * 0.1, duration: 0.4 }}
                >
                  <circle
                    cx={nx} cy={ny} r={27}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.07}
                    stroke="hsl(var(--primary))"
                    strokeOpacity={0.28}
                    strokeWidth={1}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={nx}
                      y={ny - (lines.length - 1) * 4.5 + li * 9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={7}
                      fontWeight="700"
                      fill="currentColor"
                      fillOpacity={0.82}
                    >
                      {line}
                    </text>
                  ))}
                  <text
                    x={nx}
                    y={ny + (lines.length > 1 ? 19 : 11)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={5.5}
                    fill="currentColor"
                    fillOpacity={0.38}
                  >
                    {node.sub}
                  </text>
                </motion.g>
              );
            })}

            {/* Center ambient glow */}
            <circle cx={cx} cy={cy} r={52} fill="hsl(var(--primary))" fillOpacity={0.07} />

            {/* Center ring — animated */}
            <motion.circle
              cx={cx} cy={cy} r={46}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeOpacity={0.55}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
            />

            {/* Center label */}
            <text
              x={cx} y={cy - 9}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={20}
              fontWeight="900"
              fill="hsl(var(--primary))"
            >
              IPv6
            </text>
            <text
              x={cx} y={cy + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={6}
              fontWeight="700"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
              letterSpacing={2}
            >
              FOUNDATION LAYER
            </text>
          </svg>
        </motion.div>

        {/* Node description list */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {s.nodes.map((node, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-xl border border-border/40 bg-secondary/20 px-4 py-3"
            >
              <p className="text-[12px] font-black leading-tight text-foreground">
                {node.label.replace("\n", " ")}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">{node.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}

// ─── IPv6 Adoption Line Chart ─────────────────────────────────────────────────

const VN_DATA = [22, 33, 48, 57, 60, 64] as const;
const GLOBAL_DATA = [20, 24, 27, 31, 35, 38] as const;
const CHART_YEARS = ["2019", "2020", "2021", "2022", "2023", "2024"] as const;

const CW = 500, CH = 180;
const pL = 44, pR = 60, pT = 16, pB = 28;
const cW = CW - pL - pR, cH = CH - pT - pB;

function xP(i: number) { return pL + (i / (CHART_YEARS.length - 1)) * cW; }
function yP(v: number) { return pT + cH - (v / 100) * cH; }
function toChartPath(d: readonly number[]) {
  return d.map((v, i) => `${i === 0 ? "M" : "L"}${xP(i).toFixed(1)},${yP(v).toFixed(1)}`).join(" ");
}

export function SlideAdoptionChart({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_adoption_chart;

  return (
    <Slide index={index}>
      <Eyebrow index={6} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.div
        variants={itemVariants}
        className="mt-6 overflow-hidden rounded-2xl border border-border/55 bg-secondary/20 p-5 sm:p-6"
      >
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" aria-label="Vietnam IPv6 adoption trend chart">
          {/* Horizontal gridlines */}
          {([0, 25, 50, 75, 90, 100] as const).map((v) => {
            const y = yP(v);
            const is90 = v === 90;
            return (
              <g key={v}>
                <line
                  x1={pL} y1={y} x2={CW - pR} y2={y}
                  stroke={is90 ? "hsl(var(--primary))" : "currentColor"}
                  strokeOpacity={is90 ? 0.28 : 0.07}
                  strokeWidth={is90 ? 1.5 : 1}
                  strokeDasharray={is90 ? "6 3" : "2 4"}
                />
                <text
                  x={pL - 5} y={y}
                  textAnchor="end" dominantBaseline="middle"
                  fontSize={9.5} fill="currentColor"
                  fillOpacity={is90 ? 0.55 : 0.28}
                  fontWeight={is90 ? "700" : "400"}
                >
                  {v}%
                </text>
                {is90 && (
                  <text
                    x={CW - pR + 4} y={y}
                    dominantBaseline="middle"
                    fontSize={8.5} fill="hsl(var(--primary))"
                    fillOpacity={0.6} fontWeight="700"
                  >
                    {s.targetShortLabel}
                  </text>
                )}
              </g>
            );
          })}

          {/* X-axis year labels */}
          {CHART_YEARS.map((yr, i) => (
            <text
              key={yr}
              x={xP(i)} y={CH - 4}
              textAnchor="middle"
              fontSize={10} fill="currentColor" fillOpacity={0.38}
            >
              {yr}
            </text>
          ))}

          {/* Global average line */}
          <motion.path
            d={toChartPath(GLOBAL_DATA)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 3"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Vietnam line */}
          <motion.path
            d={toChartPath(VN_DATA)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Vietnam data point circles */}
          {VN_DATA.map((v, i) => (
            <motion.circle
              key={i}
              cx={xP(i)} cy={yP(v)} r={3.5}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--card))"
              strokeWidth={1.5}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 + i * 0.18, duration: 0.3 }}
            />
          ))}

          {/* End-point value labels */}
          <text x={xP(5) + 7} y={yP(64)} dominantBaseline="middle" fontSize={12} fontWeight="800" fill="hsl(var(--primary))">
            64%
          </text>
          <text x={xP(5) + 7} y={yP(38)} dominantBaseline="middle" fontSize={10.5} fill="currentColor" fillOpacity={0.38}>
            38%
          </text>
        </svg>

        {/* Chart legend */}
        <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-border/30 pt-3 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="inline-block h-[2.5px] w-7 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">{s.vnLabel}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-[2px] w-7 rounded-full bg-foreground/25" />
            <span className="text-muted-foreground">{s.globalLabel}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-0 w-7 border-t-[1.5px] border-dashed border-primary/45" />
            <span className="text-primary/60">{s.targetLabel}</span>
          </span>
        </div>
        <p className="mt-2 text-[9px] italic text-muted-foreground/38">{s.sourceNote}</p>
      </motion.div>

      {/* Stats strip */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {s.stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 text-center"
          >
            <p className="text-[1.6rem] font-black text-primary">{stat.value}</p>
            <p className="mt-1 text-[12px] font-semibold text-foreground/80">{stat.label}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/55">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}

// ─── ASEAN Comparison Bar Chart ───────────────────────────────────────────────

const ASEAN_BARS = [
  { name: "Vietnam",     flag: "🇻🇳", pct: 64, isVN: true  },
  { name: "Malaysia",    flag: "🇲🇾", pct: 55, isVN: false },
  { name: "Singapore",   flag: "🇸🇬", pct: 50, isVN: false },
  { name: "Thailand",    flag: "🇹🇭", pct: 38, isVN: false },
  { name: "Indonesia",   flag: "🇮🇩", pct: 30, isVN: false },
  { name: "Philippines", flag: "🇵🇭", pct: 18, isVN: false },
  { name: "Cambodia",    flag: "🇰🇭", pct: 10, isVN: false },
] as const;

export function SlideASEANComparison({ index }: { index: number }) {
  const T = useDeckT();
  const s = T.s_asean_chart;

  return (
    <Slide index={index}>
      <Eyebrow index={7} label={s.eyebrow} />
      <HeadlineDisplay>
        {s.headline1}{" "}
        <span className="text-primary">{s.headline2}</span>
      </HeadlineDisplay>

      <motion.div
        variants={itemVariants}
        className="mt-6 overflow-hidden rounded-2xl border border-border/55 bg-secondary/20 p-5 sm:p-6"
      >
        <div className="space-y-2.5">
          {ASEAN_BARS.map((bar, i) => (
            <div key={bar.name} className="flex items-center gap-3">
              {/* Country label */}
              <div className="flex w-28 shrink-0 items-center justify-end gap-1.5">
                <span className="text-xs">{bar.flag}</span>
                <span
                  className={`text-[10.5px] font-bold ${
                    bar.isVN ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {bar.name}
                </span>
              </div>

              {/* Bar track */}
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-secondary/40">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-lg ${
                    bar.isVN
                      ? "bg-gradient-to-r from-primary to-primary/75"
                      : "bg-primary/20"
                  }`}
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${bar.pct}%` }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.08,
                  }}
                />
                <span
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-black ${
                    bar.isVN ? "text-foreground" : "text-muted-foreground/60"
                  }`}
                >
                  {bar.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 border-t border-border/25 pt-3 text-[9px] italic text-muted-foreground/38">
          {s.sourceNote}
        </p>
      </motion.div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
            {s.highlightLabel}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/80">{s.highlightBody}</p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border/40 bg-secondary/20 p-4"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            {s.regionLabel}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{s.regionBody}</p>
        </motion.div>
      </div>

      <PullQuote className="mt-5">{s.pullquote}</PullQuote>
    </Slide>
  );
}
