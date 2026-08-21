import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const MANUSCRIPT_PATH = resolve(PROJECT_DIR, "data/reading/goodbyeThings.vi.ts");
const BOOKS_PATH = resolve(PROJECT_DIR, "data/books.ts");
const LAYOUT_PATH = resolve(PROJECT_DIR, "components/library/BreathingHousePage.tsx");
const READER_PATH = resolve(PROJECT_DIR, "components/library/FlipBookReader.tsx");
const GLOBAL_STYLES_PATH = resolve(PROJECT_DIR, "app/globals.css");

const NO_VERTICAL_SCROLL = /(?:overflow-y-(?:auto|scroll)|overflow-y\s*:\s*(?:auto|scroll))/;
const SCROLL_LIFECYCLE = /(?:leafScrollRatiosRef|syncScrollAffordances|restoreLeafScroll|scrollSurface(?:\.|\?\.)addEventListener\(\s*["']scroll["'])/;
// The no-scroll rule guards the flipbook leaves themselves. The OUTSIDE notes
// sheet scales its overview down to one page and only hands the remainder to a
// scroll box past a legibility floor, so scope this to reader-leaf rules
// instead of asserting over the whole stylesheet.
function readerLeafRules(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) =>
      /\.(?:flipreader(?:-[\w-]+)?|flip-page|flip-leaf|leaf-[\w-]+)/.test(selector))
    .map(([, , declarations]) => declarations)
    .join("\n");
}


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
        if (specifier.startsWith(".") && !/\\.(?:[cm]?[jt]sx?|json)$/i.test(specifier)) {
          return nextResolve(specifier + ".ts", context);
        }
        throw error;
      }
    }});
    const [{ buildDeck }, { GOODBYE_THINGS_PAGES: source }] = await Promise.all([
      import("./lib/library/pages.ts?verify-goodbye-no-scroll"),
      import("./data/reading/goodbyeThings.vi.ts?verify-goodbye-no-scroll"),
    ]);
    const deck = buildDeck(undefined, [], source, "sectioned", "compact", "breathing-house");
    const content = deck.filter((page) => page.kind === "content");
    const headingRuns = content.map((page) => page.heading).filter((heading, index, all) => index === 0 || heading !== all[index - 1]);
    console.log(JSON.stringify({
      totalLeaves: deck.length,
      contentLeaves: content.length,
      continuations: content.filter((page) => page.continuation).length,
      exactCopy: content.flatMap((page) => page.paragraphs ?? []).join("") === source.flatMap((page) => page.paragraphs).join(""),
      headingRuns,
      sourceHeadings: source.map((page) => page.heading),
      designLeaves: content.filter((page) => page.design).map((page) => page.design),
      visualLeaves: content.filter((page) => page.visualOnly).length,
      themes: [...new Set(content.map((page) => page.theme))],
      densities: [...new Set(content.map((page) => page.density))],
    }));
  `;
  const result = spawnSync(
    process.execPath,
    ["--no-warnings", "--experimental-strip-types", "--input-type=module", "-e", program],
    { cwd: PROJECT_DIR, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return JSON.parse(result.stdout.trim());
}

const manuscriptSource = readFileSync(MANUSCRIPT_PATH, "utf8");
const pages = readLiteralArray(manuscriptSource, "GOODBYE_THINGS_PAGES");

test("keeps every authored room and its copy in source order", () => {
  assert.equal(pages.length, 14);
  pages.forEach((page, index) => {
    assert.match(page.heading, new RegExp(`^${String(index + 1).padStart(2, "0")}\\s+[—-]\\s+\\S`));
    assert.ok(page.paragraphs.length > 0);
    assert.ok(page.paragraphs.every((paragraph) => typeof paragraph === "string" && paragraph.trim()));
  });
});

test("paginates the manuscript without losing copy and restores all authored rooms", () => {
  const summary = buildDeckSummary();
  assert.ok(summary.contentLeaves > 14, "Long copy must continue on a new leaf");
  assert.equal(summary.totalLeaves, summary.contentLeaves + 2, "Only cover and end surround content");
  assert.ok(summary.continuations > 0);
  assert.equal(summary.exactCopy, true, "Pagination must preserve exact paragraph order");
  assert.deepEqual(summary.headingRuns, summary.sourceHeadings);
  assert.deepEqual(summary.designLeaves, [
    "morning-table",
    "invisible-receipt",
    "inventory-table",
    "five-doors",
    "shared-home",
    "memory-box",
    "purchase-waitlist",
    "future-fitting-room",
    "paid-receipt",
    "space-exchange",
    "two-valid-rooms",
    "farewell-postcard",
    "enough-compass",
    "seven-day-sunpath",
  ]);
  assert.equal(summary.visualLeaves, 14);
  assert.deepEqual(summary.themes, ["breathing-house"]);
  assert.deepEqual(summary.densities, ["compact"]);
});

test("keeps the published cover wiring while using the dedicated manuscript", () => {
  const booksSource = readFileSync(BOOKS_PATH, "utf8");
  const start = booksSource.indexOf('slug: "goodbye-things"');
  const end = booksSource.indexOf("\n    slug:", start + 1);
  const bookEntry = booksSource.slice(start, end);
  assert.ok(start >= 0);
  assert.match(bookEntry, /readingTheme:\s*["']breathing-house["']/);
  assert.match(bookEntry, /readingPages:\s*{\s*vi:\s*GOODBYE_THINGS_PAGES\s*}/);
  assert.match(bookEntry, /cover:\s*["']\/books\/rendered\/goodbye-things\.webp["']/);
});

test("renders real image assets inside the complete Breathing House edition", () => {
  const readerSource = readFileSync(READER_PATH, "utf8");
  const layoutSource = readFileSync(LAYOUT_PATH, "utf8");
  assert.match(layoutSource, /\/books\/goodbye-things\/illustrations/);
  [
    "morning-table",
    "shared-home",
    "memory-box",
    "future-fitting-room",
    "two-valid-rooms",
    "farewell-postcard",
  ].forEach((name) => {
    assert.match(
      `${readerSource}\n${layoutSource}`,
      new RegExp(`["']${name}["']\\s*:`),
      `Missing real illustration asset: ${name}`,
    );
  });
  assert.match(readerSource, /<BreathingHousePage\b/);
});

test("has no vertical leaf scrolling and keeps body type at a reading size", () => {
  const layoutSource = readFileSync(LAYOUT_PATH, "utf8");
  const readerSource = readFileSync(READER_PATH, "utf8");
  const globalStyles = readFileSync(GLOBAL_STYLES_PATH, "utf8");
  assert.doesNotMatch(layoutSource, NO_VERTICAL_SCROLL);
  assert.doesNotMatch(readerLeafRules(globalStyles), NO_VERTICAL_SCROLL);
  assert.doesNotMatch(readerSource, SCROLL_LIFECYCLE);
  assert.match(layoutSource, /breathing-page[^`]*overflow-hidden/);
  const bodySize = /breathing-page[^`]*text-\[([0-9.]+)rem\]/.exec(layoutSource);
  assert.ok(bodySize && Number(bodySize[1]) >= 1, "Body type must remain at least 1rem");
});
