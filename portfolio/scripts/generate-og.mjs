/**
 * Build-time Open Graph image generator.
 *
 * Produces 1200x630 PNGs for social previews. The design goal is content-first:
 * big readable titles, one precise description, route-specific context, and a
 * consistent Yen Nhi visual system across Facebook, Zalo, LinkedIn, and X.
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import matter from "gray-matter";
import ts from "typescript";
import vm from "vm";
import { createRequire } from "module";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT_DIR = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT_DIR, "public/og");
const BLOG_DIR = resolve(ROOT_DIR, "content/blog");
const PROJECTS_DIR = resolve(ROOT_DIR, "content/projects");
const BOOKS_DATA = resolve(ROOT_DIR, "data/books.ts");

mkdirSync(OUT_DIR, { recursive: true });

const SITE = {
  name: "Nguyen Thi Yen Nhi",
  shortName: "Yen Nhi",
  domain: "startup.id.vn",
};

const LOCALE_VARIANT_RE = /\.(en|vi|ja|zh|es|fr|de|ko|ru|pt)\.mdx?$/;

const PALETTE = {
  ink: "#121417",
  muted: "#4b5563",
  soft: "#7b8493",
  line: "#d8dee8",
  page: "#f6f7f9",
  card: "#fffdf9",
  charcoal: "#20242a",
  cream: "#fbf7ef",
  blue: "#2563eb",
  indigo: "#4f46e5",
  violet: "#7c3aed",
  emerald: "#059669",
  amber: "#b7791f",
  coral: "#e2553d",
  rose: "#be3455",
  cyan: "#0e7490",
};

const PAGE_CARDS = [
  {
    slug: "home",
    label: "Portfolio",
    title: "Nguyen Thi Yen Nhi",
    subtitle: "Business Analyst",
    description:
      "Computer Science background, product thinking, and clear specs that help teams move from business need to shipped software.",
    chips: ["Requirements", "User Stories", "System Flows", "BPMN", "SQL"],
    panelLines: ["Business context", "Clear specs", "Shipped systems"],
    statLabel: "Focus",
    statValue: "BA",
    accent: PALETTE.blue,
    accentAlt: PALETTE.coral,
  },
  {
    slug: "blog",
    label: "Blog",
    title: "Nhật ký tuổi trẻ, sống chậm & chữa lành",
    subtitle: "Personal essays",
    description:
      "Những ghi chép về tuổi trẻ, overthinking, tự trọng, trưởng thành và những bài học mình nhặt nhạnh trên đường đi.",
    chips: ["Reflection", "Slow living", "Healing", "Growth"],
    panelLines: ["Tuổi trẻ", "Sống chậm", "Chữa lành"],
    statLabel: "Essays",
    statValue: "49+",
    accent: PALETTE.rose,
    accentAlt: PALETTE.amber,
  },
  {
    slug: "projects",
    label: "Case Studies",
    title: "Projects that turn requirements into working systems",
    subtitle: "Product + Engineering",
    description:
      "Clinic booking, sports field management, English learning, and database security projects with real flows and implementation detail.",
    chips: ["Laravel", "Flutter", "ASP.NET MVC", "Oracle", "Firebase"],
    panelLines: ["User flows", "System specs", "Delivery proof"],
    statLabel: "Built",
    statValue: "4 apps",
    accent: PALETTE.cyan,
    accentAlt: PALETTE.blue,
  },
  {
    slug: "certificates",
    label: "Credentials",
    title: "Certificates & verified learning",
    subtitle: "Software · Mobile · Security",
    description:
      "A focused record of coursework and credentials across software engineering, mobile development, databases, and application security.",
    chips: ["Software Engineering", "Mobile Dev", "Security", "Databases"],
    panelLines: ["Verified skills", "Focused learning", "Technical base"],
    statLabel: "Status",
    statValue: "Verified",
    accent: PALETTE.violet,
    accentAlt: PALETTE.blue,
  },
  {
    slug: "resume",
    label: "CV",
    title: "A technical BA profile built from engineering practice",
    subtitle: "CV snapshot",
    description:
      "Education, projects, and strengths at the intersection of requirements, backend systems, secure databases, and product thinking.",
    chips: ["Business Analysis", "Backend", "Database Design", "Agile"],
    panelLines: ["Profile signal", "Project evidence", "BA readiness"],
    statLabel: "Path",
    statValue: "CS",
    accent: PALETTE.emerald,
    accentAlt: PALETTE.cyan,
  },
  {
    slug: "portfolio",
    label: "Portfolio",
    title: "The story behind the work",
    subtitle: "Principles · Process · Proof",
    description:
      "The part that does not fit on a CV: how I think, what I build, how I work with ambiguity, and what keeps me improving.",
    chips: ["Product Mindset", "Execution", "Systems", "Learning"],
    panelLines: ["Work story", "Process", "Principles"],
    statLabel: "Shipped",
    statValue: "Apps",
    accent: PALETTE.coral,
    accentAlt: PALETTE.amber,
  },
  {
    slug: "books",
    label: "Library",
    title: "A galaxy of books, notes, and reflections",
    subtitle: "Reading library",
    description:
      "Books I have read, ideas I keep returning to, and notes that turn reading into something I can actually use.",
    chips: ["Book notes", "Reflection", "Learning", "Mind map"],
    panelLines: ["Book notes", "Key ideas", "Personal takeaways"],
    statLabel: "Shelf",
    statValue: "Curated",
    accent: PALETTE.amber,
    accentAlt: PALETTE.rose,
  },
  {
    slug: "mind-map",
    label: "Knowledge Garden",
    title: "Ideas mapped from books, code, design, and life",
    subtitle: "Mind map",
    description:
      "A visual knowledge garden that connects lessons, principles, and questions across the things I am learning.",
    chips: ["Books", "Code", "Design", "Life"],
    panelLines: ["Connected ideas", "Learning paths", "Reusable notes"],
    statLabel: "Map",
    statValue: "Notes",
    accent: PALETTE.emerald,
    accentAlt: PALETTE.violet,
  },
];

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function loadLocalFont(candidates) {
  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    return toArrayBuffer(readFileSync(filePath));
  }
  return new ArrayBuffer(0);
}

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

function truncate(value, max) {
  const chars = Array.from(String(value ?? "").replace(/\s+/g, " ").trim());
  if (chars.length <= max) return chars.join("");
  return `${chars.slice(0, max - 1).join("").trimEnd()}…`;
}

function compactDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function readingMinutes(content) {
  const words = String(content ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function titleSize(title, base = 58) {
  const length = Array.from(title).length;
  if (length > 92) return Math.max(36, base - 20);
  if (length > 76) return Math.max(39, base - 16);
  if (length > 58) return Math.max(43, base - 11);
  if (length > 42) return Math.max(48, base - 6);
  return base;
}

function chip(text, accent) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "8px 14px",
        borderRadius: "999px",
        background: `${accent}12`,
        border: `1px solid ${accent}35`,
        color: PALETTE.charcoal,
        fontSize: "15px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      },
    },
    truncate(text, 22),
  );
}

function dot(color) {
  return el("div", {
    style: {
      display: "flex",
      width: "9px",
      height: "9px",
      borderRadius: "50%",
      background: color,
    },
  });
}

function textureLines() {
  return el(
    "div",
    {
      style: {
        display: "flex",
        position: "absolute",
        inset: 0,
        opacity: 0.45,
      },
    },
    Array.from({ length: 12 }).map((_, i) =>
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: `${70 + i * 92}px`,
          top: 0,
          width: "1px",
          height: "630px",
          background: i % 3 === 0 ? "#e2e8f0" : "#edf1f6",
        },
      }),
    ),
  );
}

function brand({ accent, label }) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      },
    },
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px",
        },
      },
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: PALETTE.ink,
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: 800,
          },
        },
        "YN",
      ),
      el(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "2px" } },
        el(
          "div",
          {
            style: {
              display: "flex",
              fontSize: "18px",
              fontWeight: 800,
              color: PALETTE.ink,
            },
          },
          SITE.name,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: PALETTE.soft,
              fontSize: "14px",
              fontWeight: 700,
            },
          },
          dot(accent),
          label,
        ),
      ),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px",
          borderRadius: "999px",
          border: `1px solid ${PALETTE.line}`,
          color: PALETTE.muted,
          background: "#ffffff",
          fontSize: "15px",
          fontWeight: 700,
        },
      },
      SITE.domain,
    ),
  );
}

function statBox({ label, value, accent }) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        alignItems: "flex-end",
        padding: "18px 20px",
        minWidth: "150px",
        borderRadius: "18px",
        border: `1px solid ${accent}35`,
        background: `${accent}12`,
      },
    },
    el(
      "div",
      {
        style: {
          display: "flex",
          color: accent,
          fontSize: "12px",
          fontWeight: 800,
          textTransform: "uppercase",
        },
      },
      label,
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          color: PALETTE.ink,
          fontSize: "30px",
          lineHeight: 1,
          fontWeight: 900,
        },
      },
      value,
    ),
  );
}

function sidePanel({ subtitle, accent, accentAlt, lines }) {
  const panelLines = lines?.length
    ? lines.slice(0, 3)
    : ["Clear signal", "Share-ready", "Built for context"];

  return el(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "280px",
        height: "100%",
        borderRadius: "26px",
        background: PALETTE.ink,
        color: "#ffffff",
        padding: "28px",
        overflow: "hidden",
        position: "relative",
      },
    },
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        left: "28px",
        right: "28px",
        top: "96px",
        height: "1px",
        background: "rgba(255,255,255,0.16)",
      },
    }),
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        right: "-84px",
        bottom: "-72px",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        background: accentAlt,
        opacity: 0.28,
      },
    }),
    el(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "10px" } },
      el(
        "div",
        {
          style: {
            display: "flex",
            width: "54px",
            height: "8px",
            borderRadius: "999px",
            background: accent,
          },
        },
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "24px",
            fontWeight: 900,
            lineHeight: 1.18,
          },
        },
        subtitle,
      ),
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          color: "rgba(255,255,255,0.76)",
          fontSize: "18px",
          lineHeight: 1.45,
          fontWeight: 700,
        },
      },
      ...panelLines.map((line) =>
        el(
          "div",
          {
            style: {
              display: "flex",
            },
          },
          truncate(line, 28),
        ),
      ),
    ),
  );
}

function buildPageCard(config) {
  const title = truncate(config.title, 96);
  const description = truncate(config.description, 168);
  const accent = config.accent;
  const accentAlt = config.accentAlt ?? config.accent;

  return el(
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: PALETTE.page,
        fontFamily: "'OG Sans', Arial, sans-serif",
        padding: "34px",
        position: "relative",
        overflow: "hidden",
      },
    },
    textureLines(),
    el(
      "div",
      {
        style: {
          display: "flex",
          flex: 1,
          gap: "28px",
          padding: "30px",
          borderRadius: "34px",
          background: PALETTE.card,
          border: `1px solid ${PALETTE.line}`,
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.11)",
          position: "relative",
        },
      },
      el(
        "div",
        {
          style: {
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "4px 10px 2px 4px",
          },
        },
        brand({ accent, label: config.label }),
        el(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "18px" } },
          el(
            "div",
            {
              style: {
                display: "flex",
                color: accent,
                fontSize: "17px",
                fontWeight: 900,
                textTransform: "uppercase",
              },
            },
            config.subtitle,
          ),
          el(
            "div",
            {
              style: {
                display: "flex",
                color: PALETTE.ink,
                fontSize: `${titleSize(title, 62)}px`,
                lineHeight: 1.08,
                fontWeight: 900,
                maxWidth: "740px",
              },
            },
            title,
          ),
          el(
            "div",
            {
              style: {
                display: "flex",
                color: PALETTE.muted,
                fontSize: "21px",
                lineHeight: 1.48,
                fontWeight: 600,
                maxWidth: "760px",
              },
            },
            description,
          ),
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
            },
          },
          el(
            "div",
            {
              style: {
                display: "flex",
                gap: "9px",
                flexWrap: "wrap",
                maxWidth: "660px",
              },
            },
            ...(config.chips ?? []).slice(0, 5).map((item) => chip(item, accent)),
          ),
          statBox({
            label: config.statLabel,
            value: config.statValue,
            accent,
          }),
        ),
      ),
      sidePanel({ subtitle: config.subtitle, accent, accentAlt, lines: config.panelLines }),
    ),
  );
}

function buildArticleCard(config) {
  const accent = config.accent ?? PALETTE.rose;
  const accentAlt = config.accentAlt ?? PALETTE.amber;
  const title = truncate(config.title, 98);
  const description = truncate(config.description, 162);

  return el(
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: PALETTE.cream,
        fontFamily: "'OG Sans', Arial, sans-serif",
        padding: "34px",
        position: "relative",
        overflow: "hidden",
      },
    },
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        left: "34px",
        right: "34px",
        top: "34px",
        height: "8px",
        borderRadius: "999px",
        background: accent,
      },
    }),
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRadius: "28px",
          background: "#fffaf1",
          border: "1px solid #eadfcd",
          boxShadow: "0 24px 70px rgba(96, 58, 24, 0.13)",
          padding: "40px 50px 34px",
          position: "relative",
          overflow: "hidden",
        },
      },
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          right: "-130px",
          top: "70px",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          border: `38px solid ${accentAlt}30`,
        },
      }),
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: "50px",
          right: "50px",
          bottom: "112px",
          height: "1px",
          background: "#eadfcd",
        },
      }),
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "34px",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: PALETTE.ink,
              fontSize: "18px",
              fontWeight: 900,
            },
          },
          dot(accent),
          "Yen Nhi Journal",
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              color: PALETTE.soft,
              fontSize: "15px",
              fontWeight: 700,
            },
          },
          SITE.domain,
        ),
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "850px",
            flex: 1,
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: accent,
              fontSize: "16px",
              fontWeight: 900,
              textTransform: "uppercase",
            },
          },
          config.label,
          config.date ? `· ${compactDate(config.date)}` : "",
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              color: PALETTE.ink,
              fontSize: `${titleSize(title, 61)}px`,
              lineHeight: 1.08,
              fontWeight: 900,
              maxWidth: "870px",
            },
          },
          title,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              color: PALETTE.muted,
              fontSize: "22px",
              lineHeight: 1.42,
              fontWeight: 600,
              maxWidth: "820px",
            },
          },
          description,
        ),
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "9px",
              maxWidth: "760px",
            },
          },
          ...(config.chips ?? []).slice(0, 4).map((item) => chip(item, accent)),
        ),
        statBox({
          label: config.statLabel ?? "Read",
          value: config.statValue ?? "Essay",
          accent,
        }),
      ),
    ),
  );
}

function readMatter(filePath) {
  return matter(readFileSync(filePath, "utf8"));
}

function readLocalizedPost(dir, slug, preferredLocale = "vi") {
  const basePath = resolve(dir, `${slug}.mdx`);
  const baseMdPath = resolve(dir, `${slug}.md`);
  const baseActual = existsSync(basePath) ? basePath : baseMdPath;
  const base = readMatter(baseActual);
  const localizedPath = resolve(dir, `${slug}.${preferredLocale}.mdx`);
  const localizedMdPath = resolve(dir, `${slug}.${preferredLocale}.md`);
  const localizedActual = existsSync(localizedPath)
    ? localizedPath
    : existsSync(localizedMdPath)
      ? localizedMdPath
      : null;
  const localized = localizedActual ? readMatter(localizedActual) : null;
  return {
    data: localized?.data ?? base.data,
    content: localized?.content ?? base.content,
    baseData: base.data,
    baseContent: base.content,
  };
}

function blogConfig(slug) {
  const { data, content } = readLocalizedPost(BLOG_DIR, slug, "vi");
  const tags = Array.isArray(data.tags) ? data.tags.slice(0, 5) : [];
  const minutes = readingMinutes(content);
  return {
    label: tags[0] ? `Blog · ${tags[0]}` : "Blog",
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    date: data.date,
    chips: tags,
    statLabel: "Read",
    statValue: `${minutes} min`,
    accent: PALETTE.rose,
    accentAlt: PALETTE.amber,
  };
}

function projectConfig(slug) {
  const { data, content } = readLocalizedPost(PROJECTS_DIR, slug, "vi");
  const tags = Array.isArray(data.tags) ? data.tags.slice(0, 5) : [];
  return {
    label: "Project",
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: data.date,
    chips: tags.length ? tags : ["Case study", "System design", "Implementation"],
    statLabel: "Read",
    statValue: `${readingMinutes(content)} min`,
    accent: PALETTE.cyan,
    accentAlt: PALETTE.blue,
  };
}

function loadLibraryBooks() {
  if (!existsSync(BOOKS_DATA)) return [];
  const source = readFileSync(BOOKS_DATA, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require,
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(output, sandbox, { filename: BOOKS_DATA });
  return sandbox.module.exports.LIBRARY_BOOKS ?? [];
}

function bookConfig(book) {
  const title = book.titleEn ? `${book.title} · ${book.titleEn}` : book.title;
  const points = book.keyPoints?.vi ?? book.keyPoints?.en ?? [];
  return {
    label: "Book notes",
    title,
    description:
      book.coverNote?.vi ??
      book.coverNote?.en ??
      points[0] ??
      `${book.title} by ${book.author} — reading notes and reflection.`,
    chips: [book.author, "Reading notes", "Reflection"].filter(Boolean),
    statLabel: "Book",
    statValue: "Notes",
    accent: PALETTE.amber,
    accentAlt: PALETTE.rose,
  };
}

async function renderPng(node, outPath, fonts) {
  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  writeFileSync(outPath, png);
}

async function main() {
  console.log("🎨  Generating OG images…");

  const font400 = loadLocalFont([
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  ]);
  const font700 = loadLocalFont([
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
  ]);
  const fonts = [
    { name: "OG Sans", data: font400, weight: 400, style: "normal" },
    { name: "OG Sans", data: font700, weight: 700, style: "normal" },
    { name: "OG Sans", data: font700, weight: 800, style: "normal" },
    { name: "OG Sans", data: font700, weight: 900, style: "normal" },
  ].filter((font) => font.data.byteLength > 0);

  console.log(fonts.length > 0 ? "   ✓ Local social-preview fonts loaded" : "   ⚠  No fonts loaded");

  for (const page of PAGE_CARDS) {
    await renderPng(buildPageCard(page), resolve(OUT_DIR, `${page.slug}.png`), fonts);
    console.log(`   ✓ public/og/${page.slug}.png`);
  }

  const blogOutDir = resolve(OUT_DIR, "blog");
  mkdirSync(blogOutDir, { recursive: true });
  const blogFiles = readdirSync(BLOG_DIR).filter(
    (file) => /\.mdx?$/.test(file) && !LOCALE_VARIANT_RE.test(file),
  );
  for (const file of blogFiles) {
    const slug = file.replace(/\.mdx?$/, "");
    await renderPng(
      buildArticleCard(blogConfig(slug)),
      resolve(blogOutDir, `${slug}.png`),
      fonts,
    );
    console.log(`   ✓ public/og/blog/${slug}.png`);
  }

  const projectsOutDir = resolve(OUT_DIR, "projects");
  mkdirSync(projectsOutDir, { recursive: true });
  const projectFiles = readdirSync(PROJECTS_DIR).filter(
    (file) => /\.mdx?$/.test(file) && !LOCALE_VARIANT_RE.test(file),
  );
  for (const file of projectFiles) {
    const slug = file.replace(/\.mdx?$/, "");
    await renderPng(
      buildArticleCard(projectConfig(slug)),
      resolve(projectsOutDir, `${slug}.png`),
      fonts,
    );
    console.log(`   ✓ public/og/projects/${slug}.png`);
  }

  const books = loadLibraryBooks();
  const booksOutDir = resolve(OUT_DIR, "books");
  mkdirSync(booksOutDir, { recursive: true });
  for (const book of books) {
    await renderPng(
      buildArticleCard(bookConfig(book)),
      resolve(booksOutDir, `${book.slug}.png`),
      fonts,
    );
    console.log(`   ✓ public/og/books/${book.slug}.png`);
  }

  console.log("✅  Done\n");
}

main().catch((err) => {
  console.error("❌  OG generation failed:", err);
  process.exit(1);
});
