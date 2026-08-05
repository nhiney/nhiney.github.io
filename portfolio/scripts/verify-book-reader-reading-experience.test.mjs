import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");

// Only files used by the shipped reader belong here. Design-preview routes and
// their dedicated components intentionally stay outside these assertions.
const LIVE_READER_COMPONENTS = [
  "components/library/FlipBookReader.tsx",
  "components/library/ReadingOverlay.tsx",
  "components/library/BreathingHousePage.tsx",
  "components/library/FutureLabPage.tsx",
  "components/library/LayeredTimeMapPage.tsx",
  "components/library/LoopRestorationPage.tsx",
];

const LIVE_READER_STYLES = [
  "components/library/FutureLabPage.module.css",
  "components/library/LayeredTimeMapPage.module.css",
  "components/library/LoopRestorationPage.module.css",
];

const GLOBAL_STYLES_PATH = "app/globals.css";
const FLIP_READER_PATH = "components/library/FlipBookReader.tsx";

function readProjectFile(path) {
  return readFileSync(resolve(PROJECT_DIR, path), "utf8");
}

function findBalancedEnd(source, start, opening, closing) {
  assert.equal(source[start], opening, `Expected ${opening} at source offset ${start}`);

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

  throw new Error(`Could not find ${closing} after source offset ${start}`);
}

function readFunctionBody(source, name) {
  const declaration = source.indexOf(`function ${name}`);
  assert.ok(declaration >= 0, `Missing function ${name}`);

  const parametersStart = source.indexOf("(", declaration);
  assert.ok(parametersStart >= 0, `Missing parameter list for ${name}`);
  const parametersEnd = findBalancedEnd(source, parametersStart, "(", ")");
  const bodyStart = source.indexOf("{", parametersEnd);
  assert.ok(bodyStart >= 0, `Missing function body for ${name}`);
  const bodyEnd = findBalancedEnd(source, bodyStart, "{", "}");

  return source.slice(bodyStart + 1, bodyEnd);
}

function readFunctionDeclaration(source, name) {
  const declaration = source.indexOf(`function ${name}`);
  assert.ok(declaration >= 0, `Missing function ${name}`);

  const parametersStart = source.indexOf("(", declaration);
  assert.ok(parametersStart >= 0, `Missing parameter list for ${name}`);
  const parametersEnd = findBalancedEnd(source, parametersStart, "(", ")");
  const bodyStart = source.indexOf("{", parametersEnd);
  assert.ok(bodyStart >= 0, `Missing function body for ${name}`);
  const bodyEnd = findBalancedEnd(source, bodyStart, "{", "}");

  return source.slice(declaration, bodyEnd + 1);
}

function stripOverviewHelperTypes(source) {
  return source
    .replace(/:\s*BookOutsideSummary\s*\|\s*undefined/g, "")
    .replace(/:\s*OverviewSlide\[\]/g, "")
    .replace(/:\s*string\[\]\[\]/g, "")
    .replace(/:\s*string\s*\|\s*undefined/g, "")
    .replace(/:\s*string\[\]/g, "")
    .replace(/:\s*string/g, "");
}

function readFlatCssRules(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;

  while ((match = pattern.exec(withoutComments))) {
    rules.push({ selector: match[1].trim(), declarations: match[2] });
  }

  return rules;
}

function selectorIncludes(selectorList, expected) {
  const normalize = (value) => value.trim().replace(/\s+/g, " ");
  return selectorList.split(",").some((selector) => normalize(selector) === expected);
}

function fontSizesForSelector(rules, selector) {
  return rules
    .filter((rule) => selectorIncludes(rule.selector, selector))
    .map((rule) => /(?:^|;)\s*font-size\s*:\s*([^;]+)/.exec(rule.declarations)?.[1]?.trim())
    .filter(Boolean);
}

test("live book pages have no inner auto/scroll surface or scroll lifecycle", () => {
  const livePaths = [...LIVE_READER_COMPONENTS, ...LIVE_READER_STYLES];
  assert.ok(
    livePaths.every((path) => !/design-preview/i.test(path)),
    "Design-preview files must not be treated as live reader code",
  );

  const forbiddenCssOverflow = /\boverflow(?:-[xy])?\s*:\s*(?:auto|scroll)\b/i;
  const forbiddenUtilityOverflow = /\boverflow(?:-[xy])?-(?:auto|scroll)\b/i;
  const forbiddenInlineOverflow = /\boverflow(?:X|Y)?\s*:\s*["'](?:auto|scroll)["']/;
  const scrollLifecyclePatterns = [
    /\b(?:scrollTop|scrollHeight|clientHeight)\b/,
    /\b(?:add|remove)EventListener\s*\(\s*["']scroll["']/,
    /\bonScroll\s*=/,
    /\.(?:scrollTo|scrollIntoView)\s*\(/,
  ];

  LIVE_READER_STYLES.forEach((path) => {
    assert.doesNotMatch(
      readProjectFile(path),
      forbiddenCssOverflow,
      `${path} must paginate overflow instead of opening an inner scroll surface`,
    );
  });

  LIVE_READER_COMPONENTS.forEach((path) => {
    const source = readProjectFile(path);
    assert.doesNotMatch(source, forbiddenUtilityOverflow, `${path} contains a scroll utility`);
    assert.doesNotMatch(source, forbiddenInlineOverflow, `${path} contains inline scrolling`);
    scrollLifecyclePatterns.forEach((pattern) => {
      assert.doesNotMatch(source, pattern, `${path} contains inner-scroll lifecycle code`);
    });
  });

  const readerRules = readFlatCssRules(readProjectFile(GLOBAL_STYLES_PATH)).filter(
    ({ selector }) => /\.(?:flipreader(?:-[\w-]+)?|flip-page|flip-leaf|leaf-[\w-]+)/.test(selector),
  );
  assert.ok(readerRules.length > 0, "Expected live reader rules in app/globals.css");
  readerRules.forEach(({ selector, declarations }) => {
    assert.doesNotMatch(
      declarations,
      forbiddenCssOverflow,
      `Reader CSS rule ${selector} must not create an inner scroll surface`,
    );
  });
});

test("a full authored manuscript wins over a generated locale fallback", () => {
  const program = `
    const { authoredReadingLocales, resolveReadingLocale } = await import(
      "./lib/library/readingLocale.ts?verify-authored-locale"
    );
    const readingPages = { en: undefined, vi: [{ heading: "Trang 1" }] };
    const generatedDecks = { en: [{ kind: "cover" }], vi: [{ kind: "cover" }] };
    console.log(JSON.stringify({
      locales: authoredReadingLocales(readingPages),
      resolved: resolveReadingLocale("en", readingPages, generatedDecks),
    }));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  assert.deepEqual(JSON.parse(result.stdout.trim()), {
    locales: ["vi"],
    resolved: "vi",
  });
});

test("pagination preserves every authored character in all live books", () => {
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
    const [{ LIBRARY_BOOKS }, { buildDeck }] = await Promise.all([
      import("./data/books.ts?verify-all-manuscripts"),
      import("./lib/library/pages.ts?verify-all-manuscripts"),
    ]);
    const results = LIBRARY_BOOKS.map((book) => {
      const source = book.readingPages?.vi ?? book.readingPages?.en ?? [];
      const deck = buildDeck(
        undefined,
        book.keyPoints?.vi ?? book.keyPoints?.en ?? [],
        source,
        book.readingLayout,
        book.readingDensity,
        book.readingTheme,
      );
      const rendered = deck
        .filter((page) => page.kind === "content")
        .flatMap((page) => page.paragraphs ?? [])
        .join("");
      return {
        slug: book.slug,
        exact: rendered === source.flatMap((page) => page.paragraphs).join(""),
      };
    });
    console.log(JSON.stringify(results));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  const books = JSON.parse(result.stdout.trim());
  assert.equal(books.length, 9);
  books.forEach(({ slug, exact }) => assert.equal(exact, true, `${slug} lost authored copy`));
});

test("oversized rich objects continue by page turn without duplicating source markers", () => {
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
    const [{ LIBRARY_BOOKS }, { buildDeck }] = await Promise.all([
      import("./data/books.ts?verify-rich-pagination"),
      import("./lib/library/pages.ts?verify-rich-pagination"),
    ]);
    let objectCount = 0;
    let valid = true;
    for (const book of LIBRARY_BOOKS) {
      const source = book.readingPages?.vi ?? book.readingPages?.en ?? [];
      const deck = buildDeck(
        undefined,
        book.keyPoints?.vi ?? book.keyPoints?.en ?? [],
        source,
        book.readingLayout,
        book.readingDensity,
        book.readingTheme,
      );
      const groups = new Map();
      deck.forEach((page) => {
        if (!page.richBlock) return;
        const group = groups.get(page.richBlock.marker) ?? [];
        group.push(page);
        groups.set(page.richBlock.marker, group);
      });
      for (const [marker, pages] of groups) {
        objectCount += 1;
        const partCount = pages[0].richBlock.partCount;
        valid &&= pages.length === partCount;
        valid &&= pages.every((page, index) => page.richBlock.partIndex === index);
        valid &&= (pages[0].paragraphs ?? []).includes(marker);
        valid &&= pages.slice(1).every((page) =>
          !(page.paragraphs ?? []).includes(marker)
        );
      }
    }
    console.log(JSON.stringify({ objectCount, valid }));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  // Includes the semantic Cuộn phim / Album ảnh comparison in the Thinking
  // dossier, which owns one readable physical leaf like the other rich objects.
  assert.deepEqual(JSON.parse(result.stdout.trim()), { objectCount: 26, valid: true });
});

test("outside overview opens on an editorial cover and retains every introduction", () => {
  const overlay = readProjectFile("components/library/ReadingOverlay.tsx");
  const helperSource = [
    "splitOverviewText",
    "packOverviewParagraphs",
    "buildOverviewSlides",
  ]
    .map((name) => readFunctionDeclaration(overlay, name))
    .map(stripOverviewHelperTypes)
    .join("\n");
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
    ${helperSource}
    const { LIBRARY_BOOKS } = await import("./data/books.ts?verify-overview-cover-flow");
    // Page boundaries may add/remove whitespace around punctuation. Compare
    // every authored non-whitespace character so prose cannot disappear or be
    // reordered without making the check brittle to line-breaking details.
    const normalize = (value) => value.replace(/\\s+/g, "");
    const reports = LIBRARY_BOOKS.map((book) => {
      const summary = book.outsideSummary?.vi;
      if (!summary) return { slug: book.slug, missing: true };
      const slides = buildOverviewSlides(summary, undefined, []);
      const opening = slides[0] ?? {};
      const introSlideIndexes = slides.flatMap((slide, index) =>
        slide.introduction?.length ? [index] : []
      );
      const lessonSlideIndexes = slides.flatMap((slide, index) =>
        slide.lessons?.length ? [index] : []
      );
      return {
        slug: book.slug,
        missing: false,
        openingKeys: Object.entries(opening)
          .filter(([, value]) => value !== undefined)
          .map(([key]) => key)
          .sort(),
        openingHeading: opening.heading,
        openingTagline: opening.tagline,
        openingHasLongForm: Boolean(
          opening.introduction?.length
          || opening.lessons?.length
          || opening.conclusion?.length
        ),
        introSlideIndexes,
        firstLessonIndex: lessonSlideIndexes[0] ?? -1,
        sourceIntroduction: normalize(summary.introduction.join(" ")),
        renderedIntroduction: normalize(
          slides.flatMap((slide) => slide.introduction ?? []).join(" ")
        ),
      };
    });
    const emptySummary = {
      heading: "Bìa biên tập",
      tagline: "Một câu dẫn vẫn có mặt trên bìa.",
      introduction: [],
      numbered: true,
      lessons: [{ heading: "Bài học đầu", paragraph: "Một ứng dụng ngắn." }],
      conclusion: [],
    };
    const emptySlides = buildOverviewSlides(emptySummary, undefined, []);
    console.log(JSON.stringify({
      reports,
      emptyOpeningKeys: Object.entries(emptySlides[0] ?? {})
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key)
        .sort(),
      emptyLessonStartsAfterCover: Boolean(emptySlides[1]?.lessons?.length),
    }));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  const audit = JSON.parse(result.stdout.trim());
  assert.equal(audit.reports.length, 9);
  audit.reports.forEach((report) => {
    assert.equal(report.missing, false, `${report.slug}: missing Vietnamese overview`);
    assert.deepEqual(
      report.openingKeys,
      ["heading", "tagline"],
      `${report.slug}: slide zero must remain an editorial cover only`,
    );
    assert.ok(report.openingHeading, `${report.slug}: opening cover lost its heading`);
    assert.ok(report.openingTagline, `${report.slug}: opening cover lost its tagline`);
    assert.equal(
      report.openingHasLongForm,
      false,
      `${report.slug}: prose must not spill onto the opening cover`,
    );
    assert.equal(report.introSlideIndexes[0], 1, `${report.slug}: introduction must start after cover`);
    assert.ok(
      report.introSlideIndexes.every((index) => index > 0 && index < report.firstLessonIndex),
      `${report.slug}: introduction slides must stay together before the lessons`,
    );
    assert.equal(
      report.renderedIntroduction,
      report.sourceIntroduction,
      `${report.slug}: overview pagination lost or reordered introduction copy`,
    );
  });
  assert.deepEqual(audit.emptyOpeningKeys, ["heading", "tagline"]);
  assert.equal(audit.emptyLessonStartsAfterCover, true);
});

test("outside overviews reserve stable header, content, and footer lanes", () => {
  const overlay = readProjectFile("components/library/ReadingOverlay.tsx");
  const styles = readProjectFile(GLOBAL_STYLES_PATH);

  assert.match(overlay, /note-sheet-content--summary/);
  assert.match(overlay, /note-overview-tagline/);
  assert.match(overlay, /note-overview-heading/);
  assert.match(overlay, /className="note-footer/);
  assert.match(overlay, /data-note-title-scale/);
  assert.match(styles, /Outside overview · collision-safe editorial frame/);

  [
    "dac-nhan-tam",
    "atomic-habits",
    "silence-of-the-lambs",
    "48-laws-of-power",
    "thinking-fast-and-slow",
    "goodbye-things",
    "muon-kiep-nhan-sinh-1",
    "muon-kiep-nhan-sinh-2",
    "muon-kiep-nhan-sinh-3",
  ].forEach((slug) => {
    assert.match(
      styles,
      new RegExp(`data-book-slug=["']${slug}["']\\] \\.note-sheet`),
      `${slug} needs an explicit paper safe zone`,
    );
  });
});

test("flipbook navigation is icon-only while keeping accessible names", () => {
  const source = readProjectFile(FLIP_READER_PATH);
  const controlsStart = source.indexOf('{/* Controls */}');
  const controlsEnd = source.indexOf('{/* Close (back to the notes view) */}', controlsStart);
  const controls = source.slice(controlsStart, controlsEnd);

  assert.ok(controlsStart >= 0 && controlsEnd > controlsStart, "Missing reader controls");
  assert.doesNotMatch(controls, /flipreader-control-label/);
  assert.doesNotMatch(controls, /is-labelled/);
  assert.match(controls, /aria-label=\{t\("libraryPage\.prev_page"\)\}/);
  assert.match(controls, /aria-label=\{t\("libraryPage\.next_page"\)\}/);
  assert.match(controls, /data-flip-action="previous"/);
  assert.match(controls, /data-flip-action="next"/);
  assert.equal(
    (controls.match(/className="flipreader-control"/g) ?? []).length,
    2,
    "Reader chrome must expose exactly two page-turn buttons",
  );
  assert.doesNotMatch(
    controls,
    />\s*\{t\("libraryPage\.(?:prev|next)_page"\)\}/,
    "Localized page-turn labels must stay in the accessibility tree, not visible chrome",
  );
  assert.match(controls, /<ChevronLeft[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*\/>/);
  assert.match(controls, /<ChevronRight[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*\/>/);
  assert.match(controls, /role="progressbar"/);
});

test("48 Laws uses the restrained editorial illustration set", () => {
  const readerSource = readProjectFile(FLIP_READER_PATH);
  const renderer = readFunctionBody(readerSource, "PowerSceneIllustration");

  assert.match(
    renderer,
    /\/books\/48-laws-of-power\/illustrations\/\$\{scene\}\.webp/,
  );
  assert.doesNotMatch(readerSource, /illustrations-kinetic/);
});

test("generic and compact reading copy never drops below one rem", () => {
  const rules = readFlatCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const selectors = [
    ".flip-leaf .leaf-body",
    '.flip-page[data-density="compact"] .leaf-body',
  ];

  selectors.forEach((selector) => {
    const sizes = fontSizesForSelector(rules, selector);
    assert.ok(sizes.length > 0, `Missing an explicit font size for ${selector}`);

    sizes.forEach((size) => {
      const rem = /^(\d+(?:\.\d+)?)rem$/.exec(size);
      assert.ok(rem, `${selector} must use a directly auditable rem size, received ${size}`);
      assert.ok(Number(rem[1]) >= 1, `${selector} must be at least 1rem, received ${size}`);
    });
  });
});

test("key diagrams stay plain, semantic, and editorial", () => {
  const readerSource = readProjectFile(FLIP_READER_PATH);
  const renderers = {
    SilenceSafetyFormula: "leaf-plain-formula",
    SilenceVulnerabilityBranch: "leaf-editorial-compare",
    SilencePowerMap: "leaf-editorial-sequence",
    PowerFlowDiagram: "leaf-editorial-sequence",
    PowerForkDiagram: "leaf-editorial-compare",
    PowerValueDependencyDiagram: "leaf-editorial-compare",
    PowerPositionMindmap: "leaf-editorial-sequence",
    PowerCoreFlexMindmap: "leaf-editorial-compare",
    KindConversationMindmap: "leaf-editorial-sequence",
    RecognitionFormula: "leaf-editorial-sequence",
    IdentityChangeDiagram: "leaf-editorial-sequence",
    HabitLoopDiagram: "leaf-editorial-sequence",
    ReviewLoopDiagram: "leaf-editorial-sequence",
    SilentProgressDiagram: "leaf-editorial-sequence",
    EnergyLevelsDiagram: "leaf-editorial-notes",
  };

  Object.entries(renderers).forEach(([name, structure]) => {
    const body = readFunctionBody(readerSource, name);
    assert.match(body, /className="leaf-plain-visual"/, `${name} needs the plain visual frame`);
    assert.match(body, new RegExp(`className="${structure}"`), `${name} needs ${structure}`);
  });

  const legacyTextRenderer = readFunctionBody(readerSource, "renderTextDiagram");
  ["leaf-editorial-sequence", "leaf-editorial-notes", "leaf-editorial-compare"].forEach(
    (structure) => assert.match(legacyTextRenderer, new RegExp(`className="${structure}"`)),
  );
});
