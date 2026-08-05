import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const MANUSCRIPT_PATH = resolve(PROJECT_DIR, "data/reading/muonKiepNhanSinh3.vi.ts");
const BOOKS_PATH = resolve(PROJECT_DIR, "data/books.ts");
const PAPERS_PATH = resolve(PROJECT_DIR, "lib/library/papers.ts");
const PAGE_STYLES_PATH = resolve(PROJECT_DIR, "components/library/FutureLabPage.module.css");
const PAGE_COMPONENT_PATH = resolve(PROJECT_DIR, "components/library/FutureLabPage.tsx");
const READER_PATH = resolve(PROJECT_DIR, "components/library/FlipBookReader.tsx");
const THEME_TOGGLE_PATH = resolve(PROJECT_DIR, "components/widgets/ThemeToggle.tsx");
const GLOBAL_STYLES_PATH = resolve(PROJECT_DIR, "app/globals.css");

const NO_VERTICAL_SCROLL = /(?:overflow-y-(?:auto|scroll)|overflow-y\s*:\s*(?:auto|scroll))/;
const SCROLL_LIFECYCLE = /(?:leafScrollRatiosRef|syncScrollAffordances|restoreLeafScroll|scrollSurface(?:\.|\?\.)addEventListener\(\s*["']scroll["'])/;
const OVERVIEW_TAGLINE = "Máy móc có thể ngày càng thông minh. Nhưng nó không thể thay con người quyết định điều gì xứng đáng để theo đuổi.";

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
    const [{ buildDeck }, { MUON_KIEP_NHAN_SINH_3_PAGES: source }] = await Promise.all([
      import("./lib/library/pages.ts?verify-mk3-no-scroll"),
      import("./data/reading/muonKiepNhanSinh3.vi.ts?verify-mk3-no-scroll"),
    ]);
    const deck = buildDeck(undefined, [], source, "sectioned", "compact", "future-ethics-lab");
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
      visualDesigns: content.filter((page) => page.visualOnly).map((page) => page.futureLabDesign),
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
const pages = readLiteralArray(manuscriptSource, "MUON_KIEP_NHAN_SINH_3_PAGES");

test("keeps every authored chapter in its numbered source order", () => {
  assert.equal(pages.length, 14);
  pages.forEach((page, index) => {
    assert.match(page.heading, new RegExp(`^${String(index + 1).padStart(2, "0")}\\s+[—-]\\s+\\S`));
    assert.ok(page.paragraphs.length > 0);
    assert.ok(page.paragraphs.every((paragraph) => typeof paragraph === "string" && paragraph.trim()));
  });
});

test("preserves science, safety, freedom, and accountability safeguards", () => {
  const content = pages.flatMap((page) => [page.heading, ...page.paragraphs]).join("\n");
  [
    "chưa phải bằng chứng lịch sử hay khoa học",
    "không dùng nhân quả hay ý chí để phán xét người đang bệnh, nghèo khó hoặc chịu tổn thương",
    "vẫn gắn với những con người và tổ chức cụ thể",
    "Mối quan hệ này có an toàn không?",
    "Mỗi người có quyền từ chối hoặc rời đi không?",
    "Ai đứng tên chịu trách nhiệm sửa?",
  ].forEach((phrase) => assert.ok(content.includes(phrase), `Missing safeguard: ${phrase}`));
});

test("keeps the restored master wording instead of the shortened paraphrases", () => {
  const content = pages.flatMap((page) => [page.heading, ...page.paragraphs]).join("\n");
  [
    "mất đi cơ hội thật",
    "Khi hệ thống sai, ai chịu trách nhiệm sửa?",
    "Điều gì đang bị khai thác?",
    "Giới hạn nên nằm ở đâu?",
    "Trách nhiệm cần quay về đúng nơi",
    "Câu chuyện, hình ảnh, trải nghiệm và ẩn dụ.",
    "Niềm tin, cảm nhận và cách lý giải cá nhân.",
    "Điều gì có thể kiểm tra?",
    "Mục đích sử dụng có rõ ràng không?",
    "Mình thật sự muốn điều gì?",
    "Quan tâm đến người bị ảnh hưởng.",
    "Nhận lỗi và sửa sai.",
    "Nhóm dễ bị tổn thương nhất",
    "đủ gần để sử dụng",
    "“điều có thể làm” với “điều nên làm”",
  ].forEach((phrase) => assert.ok(content.includes(phrase), `Missing master wording: ${phrase}`));

  [
    "mất cơ hội thật",
    "Khi sai, ai chịu trách nhiệm sửa?",
    "Sơ đồ minh họa",
    "Điều gì bị khai thác?",
    "Giới hạn nằm ở đâu?",
    "Trách nhiệm nên quay về đúng nơi",
    "Câu chuyện, ẩn dụ và trải nghiệm.",
    "Niềm tin cá nhân và cảm nhận.",
    "Điều gì kiểm tra được?",
    "Mục đích có rõ không?",
    "Mình muốn gì?",
    "Nếu sai, mình làm gì?",
    "Quan tâm và sửa sai",
    "Nhóm yếu thế nhất",
    "đủ gần để dùng",
  ].forEach((phrase) => assert.ok(!content.includes(phrase), `Found shortened paraphrase: ${phrase}`));
});

test("keeps exact copy and restores every future-lab schematic without scrolling", () => {
  const summary = buildDeckSummary();
  assert.ok(summary.contentLeaves > 14);
  assert.equal(summary.totalLeaves, summary.contentLeaves + 2);
  assert.ok(summary.continuations > 0);
  assert.equal(summary.exactCopy, true);
  assert.deepEqual(summary.headingRuns, summary.sourceHeadings);
  assert.equal(summary.hasCustomDesign, true);
  assert.equal(summary.visualLeaves, 14);
  assert.deepEqual(summary.visualDesigns, pages.map((page) => page.futureLabDesign));
  assert.deepEqual(summary.themes, ["future-ethics-lab"]);
  assert.deepEqual(summary.densities, ["compact"]);
});

test("keeps the published covers, overview copy, and paper", () => {
  const booksSource = readFileSync(BOOKS_PATH, "utf8");
  const papersSource = readFileSync(PAPERS_PATH, "utf8");
  const start = booksSource.indexOf('slug: "muon-kiep-nhan-sinh-3"');
  const bookEntry = booksSource.slice(start);
  assert.match(bookEntry, /cover:\s*["']\/books\/rendered\/muon-kiep-nhan-sinh-3\.webp["']/);
  assert.match(bookEntry, /coverBack:\s*["']\/books\/rendered\/muon-kiep-nhan-sinh-3-back\.webp["']/);
  assert.match(bookEntry, /readingTheme:\s*["']future-ethics-lab["']/);
  assert.match(bookEntry, /readingPages:\s*{\s*vi:\s*MUON_KIEP_NHAN_SINH_3_PAGES\s*}/);
  assert.ok(bookEntry.includes(OVERVIEW_TAGLINE));
  assert.ok(bookEntry.includes("Tập cuối khép lại hành trình của Thomas"));
  assert.ok(bookEntry.includes("cách mình sử dụng dữ liệu, tiền bạc, sự chú ý"));
  assert.ok(!bookEntry.includes("Tập cuối khép hành trình của Thomas"));
  assert.ok(!bookEntry.includes("cách mình dùng dữ liệu, tiền bạc, sự chú ý"));
  assert.match(papersSource, /["']muon-kiep-nhan-sinh-3["']/);
});

test("has no vertical leaf scrolling or scroll restoration lifecycle", () => {
  const component = readFileSync(PAGE_COMPONENT_PATH, "utf8");
  const styles = readFileSync(PAGE_STYLES_PATH, "utf8");
  const reader = readFileSync(READER_PATH, "utf8");
  const globalStyles = readFileSync(GLOBAL_STYLES_PATH, "utf8");
  [component, styles, globalStyles].forEach((source) => assert.doesNotMatch(source, NO_VERTICAL_SCROLL));
  assert.doesNotMatch(component, /Cuộn để đọc toàn trang/);
  assert.doesNotMatch(reader, SCROLL_LIFECYCLE);
  const bodySize = /\.page\s*{[\s\S]*?font-size:\s*([0-9.]+)rem;/.exec(styles);
  assert.ok(bodySize && Number(bodySize[1]) >= 1, "Body type must remain at least 1rem");
});

test("keeps the labeled light and dark mode control in the reader", () => {
  const reader = readFileSync(READER_PATH, "utf8");
  const toggle = readFileSync(THEME_TOGGLE_PATH, "utf8");
  assert.match(reader, /{isFutureLab\s*\?\s*\([\s\S]*?<ThemeToggle\b[\s\S]*?showLabel/);
  assert.match(reader, /Giao diện sáng/);
  assert.match(reader, /Giao diện tối/);
  assert.match(toggle, /aria-label\s*=\s*{\s*targetLabel\s*}/);
  assert.match(toggle, /aria-pressed\s*=\s*{\s*theme\s*===\s*["']dark["']\s*}/);
});
