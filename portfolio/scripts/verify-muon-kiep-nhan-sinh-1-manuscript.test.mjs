import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const MANUSCRIPT_PATH = resolve(PROJECT_DIR, "data/reading/muonKiepNhanSinh1.vi.ts");
const BOOKS_PATH = resolve(PROJECT_DIR, "data/books.ts");
const PAGE_STYLES_PATH = resolve(PROJECT_DIR, "components/library/LayeredTimeMapPage.module.css");
const PAGE_COMPONENT_PATH = resolve(PROJECT_DIR, "components/library/LayeredTimeMapPage.tsx");
const READER_PATH = resolve(PROJECT_DIR, "components/library/FlipBookReader.tsx");
const GLOBAL_STYLES_PATH = resolve(PROJECT_DIR, "app/globals.css");

const NO_VERTICAL_SCROLL = /(?:overflow-y-(?:auto|scroll)|overflow-y\s*:\s*(?:auto|scroll))/;
const SCROLL_LIFECYCLE = /(?:leafScrollRatiosRef|syncScrollAffordances|restoreLeafScroll|scrollSurface(?:\.|\?\.)addEventListener\(\s*["']scroll["'])/;

function findBalancedEnd(source, start, opening, closing) {
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === opening) depth += 1;
    if (character === closing) depth -= 1;
    if (depth === 0) return index;
  }
  throw new Error(`Could not find ${closing} after offset ${start}`);
}

function readLiteralArray(source, exportName) {
  const declaration = new RegExp(`\\bexport\\s+const\\s+${exportName}\\b`).exec(source);
  assert.ok(declaration, `Missing exported ${exportName} array`);
  const assignment = source.indexOf("=", declaration.index);
  const start = source.indexOf("[", assignment);
  const end = findBalancedEnd(source, start, "[", "]");
  return Array.from(new vm.Script(`(${source.slice(start, end + 1)})`).runInNewContext(
    Object.create(null),
    { timeout: 1_000 },
  ));
}

function buildDeckSummary() {
  const program = `
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      try { return nextResolve(specifier, context); }
      catch (error) {
        if (specifier.startsWith(".") && !/\\.(?:[cm]?[jt]sx?|json)$/i.test(specifier)) return nextResolve(specifier + ".ts", context);
        throw error;
      }
    }});
    const [{ buildDeck }, { MUON_KIEP_NHAN_SINH_1_PAGES: source }] = await Promise.all([
      import("./lib/library/pages.ts?verify-mk1-no-scroll"),
      import("./data/reading/muonKiepNhanSinh1.vi.ts?verify-mk1-no-scroll"),
    ]);
    const deck = buildDeck(undefined, [], source, "sectioned", "compact", "layered-time-map");
    const content = deck.filter((page) => page.kind === "content");
    const headingRuns = content.map((page) => page.heading).filter((heading, index, all) => index === 0 || heading !== all[index - 1]);
    console.log(JSON.stringify({
      totalLeaves: deck.length,
      contentLeaves: content.length,
      continuations: content.filter((page) => page.continuation).length,
      exactCopy: content.flatMap((page) => page.paragraphs ?? []).join("") === source.flatMap((page) => page.paragraphs).join(""),
      headingRuns,
      sourceHeadings: source.map((page) => page.heading),
      hasCustomDesign: content.some((page) => page.design || page.timeMapDesign || page.futureLabDesign),
      visualLeaves: content.filter((page) => page.visualOnly).length,
      visualDesigns: content.filter((page) => page.visualOnly).map((page) => page.timeMapDesign),
      themes: [...new Set(content.map((page) => page.theme))],
      densities: [...new Set(content.map((page) => page.density))],
    }));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings", "--experimental-strip-types", "--input-type=module", "-e", program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return JSON.parse(result.stdout.trim());
}

const manuscriptSource = readFileSync(MANUSCRIPT_PATH, "utf8");
const pages = readLiteralArray(manuscriptSource, "MUON_KIEP_NHAN_SINH_1_PAGES");

test("keeps every authored chapter in its numbered source order", () => {
  assert.equal(pages.length, 14);
  pages.forEach((page, index) => {
    assert.match(page.heading, new RegExp(`^${String(index + 1).padStart(2, "0")}\\s+[—-]\\s+\\S`));
    assert.ok(page.paragraphs.length > 0);
    assert.ok(page.paragraphs.every((paragraph) => typeof paragraph === "string" && paragraph.trim()));
  });
});

test("preserves the manuscript's critical-reading and anti-blame safeguards", () => {
  const content = pages.flatMap((page) => [page.heading, ...page.paragraphs]).join("\n");
  [
    "không buộc mình phải xem mọi chi tiết là lịch sử đã được xác minh",
    "không phải lịch sử đã được khoa học xác nhận",
    "ai gặp bệnh tật, nghèo khó hoặc bạo lực là vì họ “đáng phải chịu”",
    "Một niềm tin tâm linh không nên trở thành lý do để quay lưng với người đang cần giúp đỡ",
    "Cởi mở không có nghĩa tin tất cả",
  ].forEach((phrase) => assert.ok(content.includes(phrase), `Missing safeguard: ${phrase}`));
});

test("keeps exact copy and restores every layered-time-map visual without scrolling", () => {
  const summary = buildDeckSummary();
  assert.ok(summary.contentLeaves > 14);
  assert.equal(summary.totalLeaves, summary.contentLeaves + 2);
  assert.ok(summary.continuations > 0);
  assert.equal(summary.exactCopy, true);
  assert.deepEqual(summary.headingRuns, summary.sourceHeadings);
  assert.equal(summary.hasCustomDesign, true);
  assert.equal(summary.visualLeaves, 14);
  assert.deepEqual(summary.visualDesigns, pages.map((page) => page.timeMapDesign));
  assert.deepEqual(summary.themes, ["layered-time-map"]);
  assert.deepEqual(summary.densities, ["compact"]);
});

test("keeps the published cover and dedicated manuscript wiring", () => {
  const booksSource = readFileSync(BOOKS_PATH, "utf8");
  const start = booksSource.indexOf('slug: "muon-kiep-nhan-sinh-1"');
  const end = booksSource.indexOf("\n    slug:", start + 1);
  const bookEntry = booksSource.slice(start, end);
  assert.match(bookEntry, /cover:\s*["']\/books\/rendered\/muon-kiep-nhan-sinh-1\.webp["']/);
  assert.match(bookEntry, /coverBack:\s*["']\/books\/muon-kiep-nhan-sinh-1-back\.jpg["']/);
  assert.match(bookEntry, /readingTheme:\s*["']layered-time-map["']/);
  assert.match(bookEntry, /readingPages:\s*{\s*vi:\s*MUON_KIEP_NHAN_SINH_1_PAGES\s*}/);
});

test("has no vertical leaf scrolling or scroll restoration lifecycle", () => {
  const component = readFileSync(PAGE_COMPONENT_PATH, "utf8");
  const styles = readFileSync(PAGE_STYLES_PATH, "utf8");
  const reader = readFileSync(READER_PATH, "utf8");
  const globalStyles = readFileSync(GLOBAL_STYLES_PATH, "utf8");
  [component, styles, globalStyles].forEach((source) => assert.doesNotMatch(source, NO_VERTICAL_SCROLL));
  assert.doesNotMatch(reader, SCROLL_LIFECYCLE);
  const bodySize = /\.page\s*{[\s\S]*?font-size:\s*([0-9.]+)rem;/.exec(styles);
  assert.ok(bodySize && Number(bodySize[1]) >= 1, "Body type must remain at least 1rem");
});
