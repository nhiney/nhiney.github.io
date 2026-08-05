import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");
const GLOBAL_STYLES_PATH = "app/globals.css";
const FLIP_READER_PATH = "components/library/FlipBookReader.tsx";
const DEFAULT_LEAF_WIDTH = 460;

function readProjectFile(path) {
  return readFileSync(resolve(PROJECT_DIR, path), "utf8");
}

function findBalancedEnd(source, start, opening, closing) {
  assert.equal(source[start], opening, `Expected ${opening} at source offset ${start}`);

  let depth = 0;
  let quote = null;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
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

function splitSelectorList(selectorList) {
  const selectors = [];
  let start = 0;
  let parenthesisDepth = 0;
  let bracketDepth = 0;
  let quote = null;

  for (let index = 0; index < selectorList.length; index += 1) {
    const character = selectorList[index];

    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "(") parenthesisDepth += 1;
    else if (character === ")") parenthesisDepth -= 1;
    else if (character === "[") bracketDepth += 1;
    else if (character === "]") bracketDepth -= 1;
    else if (character === "," && parenthesisDepth === 0 && bracketDepth === 0) {
      selectors.push(selectorList.slice(start, index));
      start = index + 1;
    }
  }

  selectors.push(selectorList.slice(start));
  return selectors;
}

function normalizeSelector(selector) {
  return selector.trim().replace(/\s+/g, " ");
}

function expandFunctionalSelector(selector) {
  const match = /:(?:is|where)\(/.exec(selector);
  if (!match) return [normalizeSelector(selector)];

  const opening = selector.indexOf("(", match.index);
  const closing = findBalancedEnd(selector, opening, "(", ")");
  const prefix = selector.slice(0, match.index);
  const suffix = selector.slice(closing + 1);
  const options = splitSelectorList(selector.slice(opening + 1, closing));

  return options.flatMap((option) => expandFunctionalSelector(`${prefix}${option}${suffix}`));
}

/**
 * Parse enough of the stylesheet to preserve source order and container scope.
 * The test intentionally resolves the final live declaration instead of
 * banning older rules: historical theme blocks may remain as long as the final
 * cascade guard wins.
 */
function readCssRules(source) {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];

  function visit(block, atRules = []) {
    let cursor = 0;

    while (cursor < block.length) {
      while (cursor < block.length && /\s/.test(block[cursor])) cursor += 1;
      if (cursor >= block.length) break;

      const opening = block.indexOf("{", cursor);
      if (opening < 0) break;
      const prelude = block.slice(cursor, opening).trim();
      const closing = findBalancedEnd(block, opening, "{", "}");
      const body = block.slice(opening + 1, closing);

      if (prelude.startsWith("@")) {
        visit(body, [...atRules, prelude]);
      } else if (prelude) {
        rules.push({
          selectors: splitSelectorList(prelude).flatMap(expandFunctionalSelector),
          declarations: body,
          atRules,
          order: rules.length,
        });
      }

      cursor = closing + 1;
    }
  }

  visit(css);
  return rules;
}

function declarationValue(declarations, property) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|;)\\s*${escapedProperty}\\s*:\\s*([^;]+)`, "gi");
  let value;
  let match;

  while ((match = pattern.exec(declarations))) {
    value = match[1].trim().replace(/\s*!important\s*$/i, "");
  }

  return value;
}

function withoutCssVariableFunctions(value) {
  let remaining = value;
  let start = remaining.indexOf("var(");

  while (start >= 0) {
    const opening = start + 3;
    const closing = findBalancedEnd(remaining, opening, "(", ")");
    remaining = `${remaining.slice(0, start)} ${remaining.slice(closing + 1)}`;
    start = remaining.indexOf("var(");
  }

  return remaining;
}

function containerScopeApplies(atRules, width) {
  for (const atRule of atRules) {
    if (/^@media\b/i.test(atRule)) return false;
    if (!/^@container\b/i.test(atRule)) continue;

    for (const match of atRule.matchAll(/\((min|max)-width\s*:\s*([0-9.]+)px\)/gi)) {
      const boundary = Number(match[2]);
      if (match[1].toLowerCase() === "min" && width < boundary) return false;
      if (match[1].toLowerCase() === "max" && width > boundary) return false;
    }
  }

  return true;
}

function finalDeclarationAtWidth(rules, selector, property, width) {
  const normalized = normalizeSelector(selector);
  let finalValue;

  for (const rule of rules) {
    if (!rule.selectors.includes(normalized)) continue;
    if (!containerScopeApplies(rule.atRules, width)) continue;
    const value = declarationValue(rule.declarations, property);
    if (value != null) finalValue = value;
  }

  return finalValue;
}

function viewportScopeApplies(atRules, width) {
  for (const atRule of atRules) {
    if (/^@container\b/i.test(atRule)) return false;
    if (!/^@media\b/i.test(atRule)) continue;

    for (const match of atRule.matchAll(/\((min|max)-width\s*:\s*([0-9.]+)px\)/gi)) {
      const boundary = Number(match[2]);
      if (match[1].toLowerCase() === "min" && width < boundary) return false;
      if (match[1].toLowerCase() === "max" && width > boundary) return false;
    }
  }

  return true;
}

function finalDeclarationAtViewportWidth(rules, selector, property, width) {
  const normalized = normalizeSelector(selector);
  let finalValue;

  for (const rule of rules) {
    if (!rule.selectors.includes(normalized)) continue;
    if (!viewportScopeApplies(rule.atRules, width)) continue;
    const value = declarationValue(rule.declarations, property);
    if (value != null) finalValue = value;
  }

  return finalValue;
}

function assertSingleColumn(value, message) {
  assert.ok(value, `${message}: missing grid-template-columns`);
  const normalized = value.replace(/\s+/g, "").toLowerCase();
  assert.ok(
    normalized === "1fr" || normalized === "minmax(0,1fr)",
    `${message}: expected one flexible column, received ${value}`,
  );
}

function assertAuditableRem(value, minimum, context) {
  assert.ok(value, `${context}: missing an explicit font-size`);
  const match = /^([0-9]+(?:\.[0-9]+)?)rem$/.exec(value);
  assert.ok(match, `${context}: expected a directly auditable rem value, received ${value}`);
  assert.ok(
    Number(match[1]) >= minimum,
    `${context}: expected at least ${minimum}rem, received ${value}`,
  );
}

test("responsive overview rules preserve each book's paper safe zone", () => {
  const rules = readCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const slugs = [
    "dac-nhan-tam",
    "atomic-habits",
    "silence-of-the-lambs",
    "48-laws-of-power",
    "thinking-fast-and-slow",
    "goodbye-things",
    "muon-kiep-nhan-sinh-1",
    "muon-kiep-nhan-sinh-2",
    "muon-kiep-nhan-sinh-3",
  ];
  const safeProperties = ["top", "right", "bottom", "left"];

  slugs.forEach((slug) => {
    const selector = `.reading-overlay[data-book-slug="${slug}"] .note-sheet`;
    safeProperties.forEach((side) => {
      assert.ok(
        finalDeclarationAtViewportWidth(
          rules,
          selector,
          `--note-safe-${side}`,
          1024,
        ),
        `${slug}: missing the ${side} paper safe-zone token`,
      );
    });
  });

  const genericResponsiveRules = rules.filter((rule) =>
    rule.selectors.some((selector) =>
      selector.includes(".reading-overlay[data-book-slug]")
      && selector.includes(".note-sheet-content--summary")
    )
    && rule.atRules.some((atRule) =>
      /^@media\b/i.test(atRule)
      && /\bmax-(?:width|height)\s*:/i.test(atRule)
    )
  );
  const insetProperties = ["inset", "top", "right", "bottom", "left"];

  genericResponsiveRules.forEach((rule) => {
    insetProperties.forEach((property) => {
      const value = declarationValue(rule.declarations, property);
      if (value == null) return;

      assert.doesNotMatch(
        withoutCssVariableFunctions(value),
        /(?:^|[\s,(])\d+(?:\.\d+)?%/,
        `${rule.atRules.join(" ")} must not replace per-book ${property} with literal percentages outside a safe-zone fallback`,
      );
      const requiredSides = property === "inset" ? safeProperties : [property];
      requiredSides.forEach((side) => {
        assert.match(
          value,
          new RegExp(`var\\(--note-safe-${side}\\b`),
          `${rule.atRules.join(" ")} ${property} must fall back to --note-safe-${side}`,
        );
      });
    });
  });
});

test("the multi-column Silence courage route resets each inner step to one column", () => {
  const rules = readCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const wideLeaf = 560;
  const outerSelector = '.flip-page[data-theme="silence-casefile"] .leaf-silence-flow ol';
  const stepSelector = '.flip-page[data-theme="silence-casefile"] .leaf-silence-flow li';
  const outerColumns = finalDeclarationAtWidth(
    rules,
    outerSelector,
    "grid-template-columns",
    wideLeaf,
  );

  assert.match(
    outerColumns ?? "",
    /repeat\(\s*[2-9]\d*\s*,/,
    "The wide Silence courage route should remain an outer multi-column sequence",
  );
  assertSingleColumn(
    finalDeclarationAtWidth(rules, stepSelector, "grid-template-columns", wideLeaf),
    "Each Silence courage step must override the legacy inner two-column grid",
  );
});

test("responsive table and diagram guards include the default 460px leaf", () => {
  const rules = readCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const hiddenAtDefaultWidth = [
    ".flip-leaf .leaf-dac-desktop-table",
    ".flip-leaf .leaf-thinking-desktop-table",
    ".flip-leaf .leaf-thinking-matrix-desktop",
    ".flip-leaf .leaf-power-desktop-table",
  ];
  const visibleAtDefaultWidth = [
    ".flip-leaf .leaf-dac-mobile-pairs",
    ".flip-leaf .leaf-dac-consent-cards",
    ".flip-leaf .leaf-thinking-mobile-records",
    ".flip-leaf .leaf-thinking-matrix-mobile",
    ".flip-leaf .leaf-power-mobile-records",
  ];

  hiddenAtDefaultWidth.forEach((selector) => {
    assert.equal(
      finalDeclarationAtWidth(rules, selector, "display", DEFAULT_LEAF_WIDTH),
      "none",
      `${selector} must be hidden at the default ${DEFAULT_LEAF_WIDTH}px leaf width`,
    );
  });
  visibleAtDefaultWidth.forEach((selector) => {
    assert.equal(
      finalDeclarationAtWidth(rules, selector, "display", DEFAULT_LEAF_WIDTH),
      "grid",
      `${selector} must be active at the default ${DEFAULT_LEAF_WIDTH}px leaf width`,
    );
  });

  assertSingleColumn(
    finalDeclarationAtWidth(
      rules,
      '.flip-page[data-theme="silence-casefile"] .leaf-silence-flow ol',
      "grid-template-columns",
      DEFAULT_LEAF_WIDTH,
    ),
    `The Silence courage route must stack at ${DEFAULT_LEAF_WIDTH}px`,
  );
  assertSingleColumn(
    finalDeclarationAtWidth(
      rules,
      ".flip-page[data-theme=\"power-board\"] .leaf-power-formula > div",
      "grid-template-columns",
      DEFAULT_LEAF_WIDTH,
    ),
    `The Power formula must stack at ${DEFAULT_LEAF_WIDTH}px`,
  );

  for (const width of [320, DEFAULT_LEAF_WIDTH]) {
    const signSelector = '.flip-page[data-theme="power-board"] .leaf-power-formula-sign';
    assert.equal(
      finalDeclarationAtWidth(rules, signSelector, "transform", width),
      "none",
      `The stacked Power formula sign must stay upright at ${width}px`,
    );
    assert.equal(
      finalDeclarationAtWidth(rules, signSelector, "justify-self", width),
      "center",
      `The stacked Power formula sign must stay centered at ${width}px`,
    );
  }
});

test("live curated metadata and body copy keep auditable minimum type sizes", () => {
  const rules = readCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const metadataMinimum = 0.6875;
  const bodyMinimum = 0.75;

  const alwaysVisibleMetadata = [
    ".flip-leaf .leaf-rich-part-label",
    ".flip-leaf .leaf-dac-example-header > span",
    ".flip-leaf .leaf-dac-example-body h5",
    ".flip-leaf .leaf-dac-signal-badge",
    ".flip-leaf .leaf-dac-day-badge",
    ".flip-leaf .leaf-thinking-series span",
    ".flip-leaf .leaf-thinking-label span",
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-series span',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-visual-title',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-flow li strong',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-evidence-loop li > span',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-evidence-loop li > strong',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-protocol li > span',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-protocol li > strong',
    ".flip-leaf .leaf-power-series span",
    ".flip-leaf .leaf-power-phase span",
    ".flip-leaf .leaf-power-round span",
    ".flip-leaf .leaf-power-card-heading span",
    ".flip-leaf .leaf-power-visual figcaption",
    ".flip-leaf .leaf-power-visual-title",
    ".flip-leaf .leaf-power-scene-copy strong",
  ];
  const desktopMetadata = [
    ".flip-leaf .leaf-dac-desktop-table thead th",
    ".flip-leaf .leaf-dac-challenge thead th",
    ".flip-leaf .leaf-thinking-desktop-table thead th",
    ".flip-leaf .leaf-thinking-matrix > figcaption",
    ".flip-leaf .leaf-thinking-matrix thead th",
    ".flip-leaf .leaf-thinking-matrix tbody > tr > th",
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-table thead th',
    ".flip-leaf .leaf-power-compass dt",
    ".flip-leaf .leaf-power-desktop-table thead th",
    ".flip-leaf .leaf-week-table thead th",
    ".flip-leaf .leaf-compare-table thead th",
  ];
  const mobileMetadata = [
    ".flip-leaf .leaf-dac-mobile-pairs strong",
    ".flip-leaf .leaf-dac-consent-cards dt",
    ".flip-leaf .leaf-thinking-mobile-records dt",
    ".flip-leaf .leaf-thinking-matrix-mobile dt",
    ".flip-leaf .leaf-power-mobile-records dt",
    '.flip-page[data-theme="power-board"] .leaf-subheading',
    '.flip-page[data-theme="power-board"] .leaf-step-num',
  ];
  const alwaysVisibleBody = [
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-observation dd',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-brief dd',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-interrogation dd',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-flow li span',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-protocol li > p',
    ".flip-leaf .leaf-power-phase small",
    ".flip-leaf .leaf-power-compass dd",
    ".flip-leaf .leaf-power-formula strong",
    ".flip-leaf .leaf-power-scene-copy span",
  ];
  const desktopBody = [
    ".flip-leaf .leaf-dac-desktop-table tbody th",
    ".flip-leaf .leaf-dac-desktop-table tbody td",
    ".flip-leaf .leaf-dac-challenge tbody th",
    ".flip-leaf .leaf-dac-challenge tbody td",
    ".flip-leaf .leaf-thinking-desktop-table tbody th",
    ".flip-leaf .leaf-thinking-desktop-table tbody td",
    ".flip-leaf .leaf-thinking-matrix-cell strong",
    ".flip-leaf .leaf-thinking-matrix-cell span",
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-table tbody th',
    '.flip-page[data-theme="silence-casefile"] .leaf-silence-table tbody td',
    ".flip-leaf .leaf-power-desktop-table tbody th",
    ".flip-leaf .leaf-power-desktop-table tbody td",
    ".flip-leaf .leaf-week-table tbody th",
    ".flip-leaf .leaf-week-table tbody td",
    ".flip-leaf .leaf-compare-table tbody th",
    ".flip-leaf .leaf-compare-table tbody td",
  ];
  const mobileBody = [
    ".flip-leaf .leaf-dac-mobile-pairs span",
    ".flip-leaf .leaf-dac-consent-cards dd",
    ".flip-leaf .leaf-thinking-mobile-records dd",
    ".flip-leaf .leaf-thinking-matrix-mobile dd",
    ".flip-leaf .leaf-power-mobile-records dd",
  ];

  for (const width of [320, DEFAULT_LEAF_WIDTH, 560]) {
    alwaysVisibleMetadata.forEach((selector) => {
      assertAuditableRem(
        finalDeclarationAtWidth(rules, selector, "font-size", width),
        metadataMinimum,
        `${selector} at ${width}px`,
      );
    });
    alwaysVisibleBody.forEach((selector) => {
      assertAuditableRem(
        finalDeclarationAtWidth(rules, selector, "font-size", width),
        bodyMinimum,
        `${selector} at ${width}px`,
      );
    });
  }

  desktopMetadata.forEach((selector) => {
    assertAuditableRem(
      finalDeclarationAtWidth(rules, selector, "font-size", 560),
      metadataMinimum,
      `${selector} at 560px`,
    );
  });
  desktopBody.forEach((selector) => {
    assertAuditableRem(
      finalDeclarationAtWidth(rules, selector, "font-size", 560),
      bodyMinimum,
      `${selector} at 560px`,
    );
  });
  for (const width of [320, DEFAULT_LEAF_WIDTH]) {
    mobileMetadata.forEach((selector) => {
      assertAuditableRem(
        finalDeclarationAtWidth(rules, selector, "font-size", width),
        metadataMinimum,
        `${selector} at ${width}px`,
      );
    });
    mobileBody.forEach((selector) => {
      assertAuditableRem(
        finalDeclarationAtWidth(rules, selector, "font-size", width),
        bodyMinimum,
        `${selector} at ${width}px`,
      );
    });
  }
});

test("Power-board phone metadata keeps a viewport-enforced 11px floor", () => {
  const rules = readCssRules(readProjectFile(GLOBAL_STYLES_PATH));
  const selectors = [
    '.flip-page[data-theme="power-board"] .leaf-subheading',
    '.flip-page[data-theme="power-board"] .leaf-step-num',
  ];

  for (const width of [320, 390, DEFAULT_LEAF_WIDTH]) {
    selectors.forEach((selector) => {
      assertAuditableRem(
        finalDeclarationAtViewportWidth(rules, selector, "font-size", width),
        0.6875,
        `${selector} at a ${width}px phone viewport`,
      );
    });
  }

  assert.equal(
    finalDeclarationAtViewportWidth(
      rules,
      '.flip-page[data-theme="power-board"] .leaf-subheading',
      "font-size",
      1024,
    ),
    "0.66rem",
    "The phone legibility guard must not change the desktop subheading scale",
  );
});

test("agreed high-risk markers paginate into rich parts without duplicating rows", () => {
  const expectedPartCounts = {
    "[[dac-illustration:deadline]]": 2,
    "[[dac-illustration:child-recognition]]": 2,
    "[[dac-illustration:money-disagreement]]": 3,
    "[[seven-day-care-table]]": 2,
    "[[power-values-flex-table]]": 2,
  };
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
      import("./data/books.ts?verify-legibility-pagination"),
      import("./lib/library/pages.ts?verify-legibility-pagination"),
    ]);
    const expected = ${JSON.stringify(expectedPartCounts)};
    const groups = Object.fromEntries(Object.keys(expected).map((marker) => [marker, []]));
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
      for (const page of deck) {
        if (page.richBlock && groups[page.richBlock.marker]) {
          groups[page.richBlock.marker].push({
            partIndex: page.richBlock.partIndex,
            partCount: page.richBlock.partCount,
            carriesMarker: (page.paragraphs ?? []).includes(page.richBlock.marker),
          });
        }
      }
    }
    console.log(JSON.stringify(groups));
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  const groups = JSON.parse(result.stdout.trim());
  for (const [marker, expectedCount] of Object.entries(expectedPartCounts)) {
    assert.equal(groups[marker].length, expectedCount, `${marker} needs ${expectedCount} leaves`);
    groups[marker].forEach((part, index) => {
      assert.equal(part.partIndex, index, `${marker} part indexes must be contiguous`);
      assert.equal(part.partCount, expectedCount, `${marker} must expose its total part count`);
      assert.equal(
        part.carriesMarker,
        index === 0,
        `${marker} must keep its source marker only on the first rich-part leaf`,
      );
    });
  }

  const readerSource = readProjectFile(FLIP_READER_PATH);
  const richRenderer = readFunctionBody(readerSource, "renderRichBlockPart");
  const splitRenderers = {
    SevenDayCareTable: "SEVEN_DAY_CARE_ROWS",
    PowerValuesFlexTable: "POWER_VALUES_FLEX_ROWS",
  };

  for (const [renderer, rows] of Object.entries(splitRenderers)) {
    assert.match(
      readFunctionBody(readerSource, renderer),
      new RegExp(`itemsForPart\\(${rows},\\s*partIndex,\\s*partCount\\)`),
      `${renderer} must slice its rows for the active rich part`,
    );
    assert.match(
      richRenderer,
      new RegExp(`<${renderer}\\s+partIndex=\\{partIndex\\}\\s+partCount=\\{partCount\\}\\s*/>`),
      `renderRichBlockPart must forward pagination to ${renderer}`,
    );
  }
});
