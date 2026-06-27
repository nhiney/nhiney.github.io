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
    label: "Nguyen Thi Yen Nhi",
    title: "Business Analyst",
    subtitle: "Tech-savvy · IT background",
    description:
      "I turn business needs into user stories, system flows, and clear specs — bridging stakeholders and engineering, backed by a Computer Science foundation.",
    chips: ["User Stories", "BPMN 2.0", "Data Modeling", "Agile / Scrum", "SQL"],
    footer: "Business Analysis · Data · Product",
    statLabel: "Focus",
    statValue: "BA",
    accent: PALETTE.blue,
    accentAlt: PALETTE.violet,
  },
  {
    slug: "blog",
    label: "Blog",
    title: "Nhật ký tuổi trẻ, sống chậm & chữa lành",
    subtitle: "Personal essays",
    description:
      "Những ghi chép về tuổi trẻ, overthinking, tự trọng, trưởng thành và những bài học mình nhặt nhạnh trên đường đi.",
    chips: ["Reflection", "Slow living", "Healing", "Growth"],
    footer: "Personal essays · Slow living · Books",
    statLabel: "Essays",
    statValue: "60+",
    accent: PALETTE.rose,
    accentAlt: PALETTE.amber,
    variant: "editorial",
  },
  {
    slug: "projects",
    label: "Case Studies",
    title: "Product Case Studies",
    subtitle: "Product + Engineering",
    description:
      "Clinic booking, sports field management, English learning, and database security projects with real flows and implementation detail.",
    chips: ["Laravel", "Flutter", "ASP.NET MVC", "Oracle", "Firebase"],
    footer: "Product flows · System design · Delivery",
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
    footer: "Software · Mobile · Security",
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
    footer: "CV · Projects · Technical BA",
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
    footer: "Principles · Process · Proof",
    statLabel: "Shipped",
    statValue: "Apps",
    accent: PALETTE.coral,
    accentAlt: PALETTE.amber,
  },
  {
    slug: "books",
    label: "Library",
    title: "Reading Library",
    subtitle: "Reading library",
    description:
      "Books I have read, ideas I keep returning to, and notes that turn reading into something I can actually use.",
    chips: ["Book notes", "Reflection", "Learning", "Mind map"],
    footer: "Book notes · Reflection · Learning",
    statLabel: "Shelf",
    statValue: "Curated",
    accent: PALETTE.amber,
    accentAlt: PALETTE.rose,
    variant: "editorial",
  },
  {
    slug: "mind-map",
    label: "Knowledge Garden",
    title: "Knowledge Garden",
    subtitle: "Mind map",
    description:
      "A visual knowledge garden that connects lessons, principles, and questions across the things I am learning.",
    chips: ["Books", "Code", "Design", "Life"],
    footer: "Books · Code · Design · Life",
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
        justifyContent: "center",
        height: "36px",
        padding: "0 16px",
        borderRadius: "7px",
        background: `${accent}0f`,
        border: `1px solid ${accent}28`,
        color: "#334155",
        fontSize: "14px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      },
    },
    truncate(text, 24),
  );
}

function dot(color, size = 9) {
  return el("div", {
    style: {
      display: "flex",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: color,
    },
  });
}

function brandPill({ accent }) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "38px",
        padding: "0 14px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.82)",
        border: "1px solid #e4ebf5",
        boxShadow: `0 14px 34px ${accent}18`,
        color: "#0f172a",
        fontSize: "16px",
        fontWeight: 800,
      },
    },
    dot(accent),
    SITE.name,
  );
}

function topBrand({ accent }) {
  return el(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
      },
    },
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
          background: `linear-gradient(135deg, ${accent}, ${PALETTE.violet})`,
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 900,
        },
      },
      "YN",
    ),
    el(
      "div",
      {
        style: {
          display: "flex",
          color: "#52617a",
          fontSize: "15px",
          fontWeight: 600,
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
        gap: "5px",
        alignItems: "flex-end",
        justifyContent: "center",
        minWidth: "114px",
        height: "60px",
        padding: "0 16px",
        borderRadius: "10px",
        border: `1px solid ${accent}30`,
        background: `${accent}10`,
      },
    },
    el(
      "div",
      {
        style: {
            display: "flex",
            color: accent,
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
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
          fontSize: "24px",
          lineHeight: 1,
          fontWeight: 900,
        },
      },
      value,
    ),
  );
}

function softWash({ accent, accentAlt }) {
  return [
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        left: "-110px",
        top: "-110px",
        width: "410px",
        height: "300px",
        borderRadius: "999px",
        background: `radial-gradient(circle at center, ${accent}22 0%, ${accent}0f 36%, rgba(255,255,255,0) 70%)`,
      },
    }),
    el("div", {
      style: {
        display: "flex",
        position: "absolute",
        right: "-115px",
        bottom: "-120px",
        width: "390px",
        height: "260px",
        borderRadius: "999px",
        background: `radial-gradient(circle at center, ${accentAlt}18 0%, ${accentAlt}0c 38%, rgba(255,255,255,0) 72%)`,
      },
    }),
  ];
}

function socialCard(config, { article = false } = {}) {
  const accent = config.accent;
  const accentAlt = config.accentAlt ?? config.accent;
  // Editorial cards (blog + books) borrow the "printed book" look of the reading
  // page: warm paper stock + a serif headline. Portfolio cards stay clean sans.
  const editorial = config.variant === "editorial";
  const title = truncate(config.title, article ? 104 : 92);
  const description = truncate(config.description, article ? 168 : 158);
  const meta = article
    ? `${config.label}${config.date ? ` · ${compactDate(config.date)}` : ""}`
    : config.subtitle;
  const footer = `${SITE.domain} · ${config.footer ?? "Business Analysis · Data · Product"}`;

  return el(
    "div",
    {
      style: {
        display: "flex",
        width: "1200px",
        height: "630px",
        background: "#edf3f9",
        fontFamily: "'OG Sans', Arial, sans-serif",
        padding: "36px",
        position: "relative",
        overflow: "hidden",
      },
    },
    el(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "1128px",
          height: "558px",
          padding: "50px 52px 44px",
          borderRadius: "28px",
          background: editorial ? PALETTE.cream : "#fffefe",
          border: editorial ? "1px solid #ece1cf" : "1px solid #dce5f0",
          boxShadow: editorial
            ? "0 26px 70px rgba(120, 92, 44, 0.10)"
            : "0 26px 70px rgba(37, 99, 235, 0.08)",
          position: "relative",
          overflow: "hidden",
        },
      },
      ...softWash({ accent, accentAlt }),
      el("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: 0,
          top: "118px",
          width: "4px",
          height: "390px",
          background: `linear-gradient(180deg, ${accent}, ${accentAlt}55)`,
        },
      }),
      el(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          },
        },
        brandPill({ accent }),
        topBrand({ accent }),
      ),
      el(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: article ? "925px" : "900px",
            position: "relative",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              color: accent,
              fontSize: "16px",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            },
          },
          meta.toUpperCase(),
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              fontFamily: editorial ? "'OG Serif', Georgia, serif" : "'OG Sans', Arial, sans-serif",
              color: editorial ? "#1c1815" : "#0f172a",
              fontSize: `${titleSize(title, article ? (editorial ? 56 : 58) : 62)}px`,
              lineHeight: editorial ? 1.1 : 1.06,
              fontWeight: editorial ? 700 : 900,
              letterSpacing: editorial ? "-0.01em" : "0",
            },
          },
          title,
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              fontFamily: editorial ? "'OG Serif', Georgia, serif" : "'OG Sans', Arial, sans-serif",
              color: editorial ? "#5b5048" : "#52617a",
              fontSize: article ? (editorial ? "22px" : "21px") : "22px",
              lineHeight: editorial ? 1.5 : 1.45,
              fontWeight: editorial ? 400 : 500,
              maxWidth: article ? "860px" : "890px",
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
            gap: "24px",
            position: "relative",
          },
        },
        el(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "68px",
            },
          },
          el(
            "div",
            {
              style: {
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                maxWidth: "760px",
              },
            },
            ...(config.chips ?? []).slice(0, 5).map((item) => chip(item, accent)),
          ),
          el(
            "div",
            {
              style: {
                display: "flex",
                color: "#8aa0bd",
                fontSize: "15px",
                fontWeight: 500,
              },
            },
            footer,
          ),
        ),
        statBox({
          label: config.statLabel ?? (article ? "Read" : "Share"),
          value: config.statValue ?? "Page",
          accent,
        }),
      ),
    ),
  );
}

function buildPageCard(config) {
  return socialCard(config);
}

function buildArticleCard(config) {
  return socialCard(config, { article: true });
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
    footer: "Personal essays · Slow living · Books",
    statLabel: "Read",
    statValue: `${minutes} min`,
    accent: PALETTE.rose,
    accentAlt: PALETTE.amber,
    variant: "editorial",
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
    footer: "Case studies · System design · Delivery",
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
    footer: "Reading notes · Reflection · Books",
    statLabel: "Book",
    statValue: "Notes",
    accent: PALETTE.amber,
    accentAlt: PALETTE.rose,
    variant: "editorial",
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
  // Editorial serif (blog + book cards) — mirrors the "printed book" reading page.
  const serif400 = loadLocalFont([
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
  ]);
  const serif700 = loadLocalFont([
    "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
  ]);
  // Universal glyph fallback so Vietnamese diacritics never tofu in any family.
  const unicode = loadLocalFont([
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  ]);
  const fonts = [
    { name: "OG Sans", data: font400, weight: 400, style: "normal" },
    { name: "OG Sans", data: font700, weight: 700, style: "normal" },
    { name: "OG Sans", data: font700, weight: 800, style: "normal" },
    { name: "OG Sans", data: font700, weight: 900, style: "normal" },
    { name: "OG Serif", data: serif400, weight: 400, style: "normal" },
    { name: "OG Serif", data: serif700, weight: 700, style: "normal" },
    { name: "OG Serif", data: serif700, weight: 900, style: "normal" },
    // Fallback entries (kept last so they only fill glyphs the primaries miss).
    { name: "OG Sans", data: unicode, weight: 400, style: "normal" },
    { name: "OG Serif", data: unicode, weight: 400, style: "normal" },
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
