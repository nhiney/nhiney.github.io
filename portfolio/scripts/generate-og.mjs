/**
 * Build-time OG image generator.
 * Produces rich 1200×630 PNGs styled like a mini résumé card,
 * one per major route. Runs automatically before `next build`.
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/og");
mkdirSync(OUT_DIR, { recursive: true });

// ─── Fonts ────────────────────────────────────────────────────────────────────

async function loadFont(weight) {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.1/files/inter-latin-${weight}-normal.woff`;
  try {
    const res = await fetch(url, { headers: { Accept: "font/woff,*/*" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
  } catch {
    return new ArrayBuffer(0);
  }
}

// ─── Element builder ──────────────────────────────────────────────────────────
// Every element with 2+ children MUST have display:flex (satori rule).

function el(type, props, ...rest) {
  const children = rest
    .flat(Infinity)
    .filter((c) => c !== undefined && c !== null && c !== false && c !== "");
  const childProp =
    children.length === 0
      ? {}
      : children.length === 1
      ? { children: children[0] }
      : { children };
  return { type, props: { ...props, ...childProp } };
}

// ─── Page configs ─────────────────────────────────────────────────────────────

const PAGES = [
  {
    slug: "home",
    role: "Software Engineer · Backend Specialist",
    description:
      "Software Engineering student specialising in secure backend systems, database architecture, and mobile development with Flutter.",
    pills: ["Laravel · PHP", "Flutter · Dart", "Oracle DB", "ASP.NET MVC", "Firebase"],
    metricLabel: "Coding",
    metricValue: "442+ hrs",
    accent: "#3D96FF",
    accentAlt: "#6366f1",
  },
  {
    slug: "projects",
    role: "Engineering Projects",
    description:
      "Clinic booking, sports field management, and secured database systems — built with Laravel, Flutter, and ASP.NET MVC.",
    pills: ["Laravel", "Flutter", "ASP.NET MVC", "Oracle DB", "Firebase"],
    metricLabel: "Repositories",
    metricValue: "8+ repos",
    accent: "#22d3ee",
    accentAlt: "#3D96FF",
  },
  {
    slug: "certificates",
    role: "Certificates & Credentials",
    description:
      "Verified certifications in software engineering, mobile development, and application security.",
    pills: ["Software Engineering", "Mobile Dev", "App Security", "Databases"],
    metricLabel: "Verified",
    metricValue: "Certified",
    accent: "#a78bfa",
    accentAlt: "#6366f1",
  },
  {
    slug: "resume",
    role: "Curriculum Vitae",
    description:
      "Software Engineering student at the intersection of backend systems, secure databases, and Flutter mobile apps.",
    pills: ["Backend Systems", "Database Design", "Flutter Mobile", "Security"],
    metricLabel: "GPA",
    metricValue: "Good",
    accent: "#34d399",
    accentAlt: "#059669",
  },
  {
    slug: "portfolio",
    role: "The Engineering Story",
    description:
      "Principles, working process, and what fuels the work beyond the code — a deeper look at the engineering journey.",
    pills: ["Product Mindset", "Backend Focus", "Security-First", "4 Shipped Apps"],
    metricLabel: "Shipped",
    metricValue: "4 apps",
    accent: "#fb923c",
    accentAlt: "#f59e0b",
  },
];

// ─── Pill component ───────────────────────────────────────────────────────────

function Pill(text, accent) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: "6px",
        background: "#1e2d46",
        border: "1px solid #2a3d58",
        fontSize: "14px",
        fontWeight: 500,
        color: "#8faac8",
        whiteSpace: "nowrap",
      },
    },
    text
  );
}

// ─── Card builder ─────────────────────────────────────────────────────────────

function buildCard({ role, description, pills, metricLabel, metricValue, accent, accentAlt }) {
  const BG = "#0e1623";
  const CARD_BG = "#111d2e";
  const BORDER = "#1e2e44";
  const TEXT_PRIMARY = "#e8f0fc";
  const TEXT_MUTED = "#6a85a8";
  const TEXT_DIM = "#3d5577";

  return el(
    // ── Outermost wrapper — full 1200×630, dark bg
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: BG,
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "36px",
      },
    },

    // ── Inner card — takes all space, rounded, slightly lighter
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          borderRadius: "20px",
          border: `1px solid ${BORDER}`,
          background: CARD_BG,
          padding: "44px 52px",
          position: "relative",
          overflow: "hidden",
        },
      },

      // ── Glow top-left (rendered first → behind content visually)
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          top: "-160px",
          left: "-120px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}28 0%, transparent 65%)`,
        },
      }),
      // ── Glow bottom-right
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          bottom: "-130px",
          right: "-90px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentAlt}1a 0%, transparent 65%)`,
        },
      }),
      // ── Left accent stripe
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: 0,
          top: "15%",
          width: "3px",
          height: "70%",
          borderRadius: "3px",
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
        },
      }),

      // ════ ROW 1: name badge | spacer | avatar + domain ════════════════════

      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        // Name badge pill
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px 8px 12px",
              borderRadius: "100px",
              background: "#162236",
              border: `1px solid ${BORDER}`,
            },
          },
          // Dot indicator
          el("div", {
            style: {
              display: "flex",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 8px ${accent}`,
            },
          }),
          el(
            "span",
            {
              style: {
                fontSize: "16px",
                fontWeight: 600,
                color: TEXT_PRIMARY,
                letterSpacing: "-0.01em",
              },
            },
            "Nguyen Thi Yen Nhi"
          )
        ),

        // Avatar + domain
        el(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "12px" } },
          // Initials avatar
          el(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${accent} 0%, ${accentAlt} 100%)`,
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              },
            },
            "YN"
          ),
          el(
            "span",
            {
              style: {
                fontSize: "15px",
                fontWeight: 500,
                color: TEXT_MUTED,
                letterSpacing: "0.01em",
              },
            },
            "nhiney.github.io"
          )
        )
      ),

      // ════ ROW 2: role + description ═══════════════════════════════════════

      el(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "14px" } },
        // Role / page title
        el(
          "div",
          {
            style: {
              fontSize: "52px",
              fontWeight: 800,
              color: TEXT_PRIMARY,
              lineHeight: "1.08",
              letterSpacing: "-0.04em",
            },
          },
          role
        ),
        // Description
        el(
          "div",
          {
            style: {
              fontSize: "20px",
              fontWeight: 400,
              color: TEXT_MUTED,
              lineHeight: "1.55",
              maxWidth: "820px",
            },
          },
          description
        )
      ),

      // ════ ROW 3: tech pills ════════════════════════════════════════════════

      el(
        "div",
        { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
        ...pills.map((p) => Pill(p, accent))
      ),

      // ════ ROW 4: bottom bar ════════════════════════════════════════════════

      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        // Left: domain + role hint
        el(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "12px" } },
          el(
            "span",
            { style: { fontSize: "15px", fontWeight: 500, color: TEXT_DIM } },
            "nhiney.github.io"
          ),
          el("div", {
            style: {
              display: "flex",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: TEXT_DIM,
            },
          }),
          el(
            "span",
            { style: { fontSize: "15px", fontWeight: 500, color: TEXT_DIM } },
            "Backend · Mobile · Security"
          )
        ),

        // Right: metric badge
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "10px",
              background: `${accent}18`,
              border: `1px solid ${accent}35`,
            },
          },
          el(
            "div",
            { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" } },
            el(
              "span",
              {
                style: {
                  fontSize: "11px",
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                },
              },
              metricLabel
            ),
            el(
              "span",
              {
                style: {
                  fontSize: "22px",
                  fontWeight: 800,
                  color: TEXT_PRIMARY,
                  letterSpacing: "-0.03em",
                  lineHeight: "1.1",
                },
              },
              metricValue
            )
          )
        )
      )
    )
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🎨  Generating OG images…");

  const [font400, font700] = await Promise.all([loadFont(400), loadFont(700)]);
  const fonts = [
    { name: "Inter", data: font400, weight: 400, style: "normal" },
    { name: "Inter", data: font700, weight: 700, style: "normal" },
    { name: "Inter", data: font700, weight: 800, style: "normal" },
  ].filter((f) => f.data.byteLength > 0);

  console.log(fonts.length > 0 ? "   ✓ Fonts loaded" : "   ⚠  No fonts — text may fall back to system font");

  for (const page of PAGES) {
    const card = buildCard(page);

    const svg = await satori(card, {
      width: 1200,
      height: 630,
      fonts,
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    const png = resvg.render().asPng();

    const out = resolve(OUT_DIR, `${page.slug}.png`);
    writeFileSync(out, png);
    console.log(`   ✓ public/og/${page.slug}.png`);
  }

  console.log("✅  Done\n");
}

main().catch((err) => {
  console.error("❌  OG generation failed:", err);
  process.exit(1);
});
