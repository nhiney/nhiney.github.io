import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const MANUSCRIPT_PATH = resolve(
  PROJECT_DIR,
  "data/reading/muonKiepNhanSinh2.vi.ts",
);
const BOOKS_PATH = resolve(PROJECT_DIR, "data/books.ts");
const PAPERS_PATH = resolve(PROJECT_DIR, "lib/library/papers.ts");
const PAGE_STYLES_PATH = resolve(
  PROJECT_DIR,
  "components/library/LoopRestorationPage.module.css",
);
const OVERLAY_PATH = resolve(
  PROJECT_DIR,
  "components/library/ReadingOverlay.tsx",
);

const EXPECTED_DESIGNS = [
  "ripple-butterfly",
  "loop-break",
  "culture-weave",
  "responsibility-rings",
  "fear-wall",
  "achievement-mountain",
  "love-control-knot",
  "sound-memory-wave",
  "threshold-today",
  "repair-stages",
  "forgiveness-gate",
  "storm-checks",
  "accountable-repair",
  "seven-day-thread",
];

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

const manuscriptSource = readFileSync(MANUSCRIPT_PATH, "utf8");
const pages = readLiteralArray(
  manuscriptSource,
  "MUON_KIEP_NHAN_SINH_2_PAGES",
);

test("keeps all fourteen authored chapters and their selected visual language", () => {
  assert.equal(pages.length, 14);
  assert.deepEqual(pages.map((page) => page.loopDesign), EXPECTED_DESIGNS);
  pages.forEach((page, index) => {
    assert.ok(page.heading.startsWith(`${String(index + 1).padStart(2, "0")} — `));
    assert.ok(page.paragraphs.length > 0);
    assert.ok(page.paragraphs.every((paragraph) => typeof paragraph === "string"));
  });
});

test("restores the original overview paper while keeping the replacement copy", () => {
  const booksSource = readFileSync(BOOKS_PATH, "utf8");
  const papersSource = readFileSync(PAPERS_PATH, "utf8");
  const overlaySource = readFileSync(OVERLAY_PATH, "utf8");
  const bookStart = booksSource.indexOf('slug: "muon-kiep-nhan-sinh-2"');
  const nextBook = booksSource.indexOf("\n    slug:", bookStart + 1);
  const bookEntry = booksSource.slice(bookStart, nextBook);

  assert.ok(bookStart >= 0);
  assert.match(bookEntry, /Một vòng lặp không kết thúc/);
  assert.match(bookEntry, /Tập 2 tiếp tục hành trình của Thomas/);
  assert.match(bookEntry, /readingTheme:\s*"loop-restoration-workshop"/);
  assert.doesNotMatch(bookEntry, /loop-restoration-overview/);
  assert.match(papersSource, /"muon-kiep-nhan-sinh-2"/);
  assert.doesNotMatch(overlaySource, /loop-restoration-overview|loop-overview/);
});

test("paginates without losing copy, duplicating art, or repeating the notes field", () => {
  const verificationProgram = `
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      try { return nextResolve(specifier, context); }
      catch (error) {
        if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier)) {
          return nextResolve(specifier + ".ts", context);
        }
        throw error;
      }
    }});
    const [{ buildDeck }, { MUON_KIEP_NHAN_SINH_2_PAGES: source }] = await Promise.all([
      import("./lib/library/pages.ts?verify-mk2"),
      import("./data/reading/muonKiepNhanSinh2.vi.ts"),
    ]);
    const deck = buildDeck(undefined, [], source, "sectioned", "compact", "loop-restoration-workshop");
    const content = deck.filter((page) => page.kind === "content");
    const exact = source.every((section) => section.paragraphs.join("") === content
      .filter((page) => page.heading === section.heading)
      .flatMap((page) => page.paragraphs ?? [])
      .join(""));
    console.log(JSON.stringify({
      totalLeaves: deck.length,
      contentLeaves: content.length,
      exact,
      figures: content.filter((page) => page.loopFigureAfter !== undefined).length,
      notes: content.filter((page) => page.loopShowNotes).length,
      perChapter: source.map((section) => content.filter((page) => page.heading === section.heading).length),
    }));
  `;
  const result = spawnSync(
    process.execPath,
    ["--no-warnings", "--experimental-strip-types", "--input-type=module", "-e", verificationProgram],
    { cwd: PROJECT_DIR, encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(result.stdout.trim());
  assert.equal(summary.totalLeaves, summary.contentLeaves + 2);
  assert.ok(summary.contentLeaves > 29, "Smaller no-scroll leaves should create more page turns");
  assert.equal(summary.exact, true);
  assert.equal(summary.figures, 14);
  assert.equal(summary.notes, 1);
  assert.ok(summary.perChapter.every((count) => count > 1));
});

test("uses page turns instead of an inner vertical scrollbar", () => {
  const styles = readFileSync(PAGE_STYLES_PATH, "utf8");
  const pageRule = /\.page\s*{([\s\S]*?)\n}/.exec(styles)?.[1] ?? "";

  assert.match(pageRule, /overflow:\s*hidden/);
  assert.doesNotMatch(pageRule, /overflow-y:\s*auto/);
  assert.match(pageRule, /font-size:\s*1\.0625rem/);
  assert.match(pageRule, /line-height:\s*1\.65/);
  assert.match(styles, /\.notes\s*{[\s\S]*?resize:\s*none/);
  assert.match(styles, /\.page\[data-continuation="true"\]/);
});
