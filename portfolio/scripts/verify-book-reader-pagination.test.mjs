import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");

function runPaginationProbe(body) {
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
    ${body}
  `;
  const result = spawnSync(process.execPath, [
    "--no-warnings",
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    program,
  ], { cwd: PROJECT_DIR, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return JSON.parse(result.stdout.trim());
}

test("sparse visual leads use only the guarded five-percent soft cap", () => {
  const cases = runPaginationProbe(`
    const { buildDeck } = await import("./lib/library/pages.ts?soft-cap-regression");
    const marker = "[[silence-observation-notes]]";
    const probes = [
      { id: "soft-cap", intro: "a".repeat(210), lead: "b".repeat(18) },
      { id: "not-sparse", intro: "a".repeat(218), lead: "b".repeat(18) },
      { id: "over-cap", intro: "a".repeat(216), lead: "b".repeat(36) },
    ];
    const result = Object.fromEntries(probes.map((probe) => {
      const source = [{
        heading: "Guard probe",
        paragraphs: [probe.intro, probe.lead, marker, "Kết."],
      }];
      const leaves = buildDeck(
        undefined,
        [],
        source,
        "sectioned",
        "compact",
        "silence-casefile",
      ).filter((page) => page.kind === "content");
      return [probe.id, leaves.map((page) => page.paragraphs)];
    }));
    console.log(JSON.stringify(result));
  `);

  // 210 + 18 + 400 = 628: above the normal 620 budget, but below 651 (105%).
  assert.deepEqual(cases["soft-cap"][0].map((block) => block.length), [210, 18, 29]);

  // A leaf at or above 35% cannot borrow from the soft cap.
  assert.deepEqual(cases["not-sparse"][0].map((block) => block.length), [218]);
  assert.deepEqual(cases["not-sparse"][1].slice(0, 2).map((block) => block.length), [18, 29]);

  // 216 + 36 + 400 = 652: one unit beyond the soft cap, so it must turn first.
  assert.deepEqual(cases["over-cap"][0].map((block) => block.length), [216]);
  assert.deepEqual(cases["over-cap"][1].slice(0, 2).map((block) => block.length), [36, 29]);
});

test("all live decks avoid accidental short leaves before curated visuals", () => {
  const audit = runPaginationProbe(`
    const [{ LIBRARY_BOOKS }, pages] = await Promise.all([
      import("./data/books.ts?pagination-regression-books"),
      import("./lib/library/pages.ts?pagination-regression-pages"),
    ]);
    const allowlist = new Set(pages.CURATED_VISUAL_LEAD_BREAK_ALLOWLIST);
    const isVisualMarker = (block) => block?.startsWith("[[")
      && !block.startsWith("[[power-round:");
    const decks = LIBRARY_BOOKS.map((book) => {
      const source = book.readingPages?.vi ?? book.readingPages?.en ?? [];
      const deck = pages.buildDeck(
        undefined,
        book.keyPoints?.vi ?? book.keyPoints?.en ?? [],
        source,
        book.readingLayout,
        book.readingDensity,
        book.readingTheme,
      );
      return { book, source, deck };
    });

    const silence = decks.find(({ book }) => book.slug === "silence-of-the-lambs");
    const courageSection = silence.source.find((page) => page.heading.startsWith("02 —"));
    const courageLeaf = silence.deck.find((page) =>
      (page.paragraphs ?? []).includes("[[silence-courage-flow]]")
    );
    const rescueChecklist = [
      "- Trả lời tin nhắn ngay cả khi đã kiệt sức.",
      "- Nhận thêm việc vì sợ người khác thất vọng.",
      "- Cố chữa lành một người không muốn thay đổi.",
      "- Cảm thấy có lỗi khi không thể cứu tất cả.",
    ];
    const rescueLeaves = silence.deck.filter((page) =>
      (page.paragraphs ?? []).some((paragraph) => rescueChecklist.includes(paragraph))
    );

    const orphanRisks = [];
    const terminalHeadingRisks = [];
    for (const { book, deck } of decks) {
      for (let index = 0; index < deck.length - 1; index += 1) {
        const page = deck[index];
        const nextPage = deck[index + 1];
        const terminalBlock = page.kind === "content"
          ? (page.paragraphs ?? []).at(-1)
          : undefined;
        if (
          terminalBlock
          && (/^###\\s/.test(terminalBlock) || /^\\*\\*[^*]+\\*\\*$/.test(terminalBlock))
          && nextPage.kind === "content"
          && page.heading === nextPage.heading
        ) {
          terminalHeadingRisks.push({
            slug: book.slug,
            heading: page.heading,
            terminalBlock,
          });
        }
        if (
          page.kind !== "content"
          || nextPage.kind !== "content"
          || page.heading !== nextPage.heading
          || nextPage.richBlock
        ) continue;

        const marker = (nextPage.paragraphs ?? []).slice(0, 3).find(isVisualMarker);
        const paragraphs = page.paragraphs ?? [];
        if (
          !marker
          || allowlist.has(marker)
          || paragraphs.length === 0
          || paragraphs.some(isVisualMarker)
        ) continue;

        // 620 is the smallest general curated budget. Count the vertical
        // rhythm of list cards and standalone labels as well as their glyphs;
        // a complete three-item checklist is not a sparse prose orphan.
        const estimatedWeight = paragraphs.reduce((total, block) => {
          if (/^###\s/.test(block)) return total + block.length + 110;
          if (/^-\s/.test(block)) return total + block.length + 40;
          if (/^\\*\\*[^*]+\\*\\*$/.test(block)) return total + block.length + 55;
          return total + block.length;
        }, 0);
        if (estimatedWeight < 620 * 0.35) {
          orphanRisks.push({
            slug: book.slug,
            heading: page.heading,
            paragraphs,
            marker,
          });
        }
      }
    }

    const exactManuscripts = decks.map(({ book, source, deck }) => ({
      slug: book.slug,
      exact: deck
        .filter((page) => page.kind === "content")
        .flatMap((page) => page.paragraphs ?? [])
        .join("") === source.flatMap((page) => page.paragraphs).join(""),
    }));

    const expectedRichParts = {
      "[[dac-illustration:deadline]]": 2,
      "[[dac-illustration:child-recognition]]": 2,
      "[[dac-illustration:money-disagreement]]": 3,
      "[[seven-day-care-table]]": 2,
      "[[silence-help-table]]": 2,
      "[[power-values-flex-table]]": 2,
      "[[power-scene-illustration:stage]]": 1,
      "[[power-scene-illustration:coat]]": 1,
      "[[power-scene-illustration:water]]": 1,
      "[[power-scene-illustration:gift]]": 1,
      "[[power-scene-illustration:shadow]]": 1,
      "[[power-scene-illustration:knot]]": 1,
    };
    const richParts = {};
    for (const [marker, expectedPartCount] of Object.entries(expectedRichParts)) {
      const owner = decks.find(({ source }) => source.some((section) =>
        section.paragraphs.includes(marker)
      ));
      const sourceSection = owner.source.find((section) => section.paragraphs.includes(marker));
      const markerIndex = sourceSection.paragraphs.indexOf(marker);
      const lead = sourceSection.paragraphs[markerIndex - 1];
      const parts = owner.deck.filter((page) => page.richBlock?.marker === marker);
      const leadPages = lead === undefined ? [] : owner.deck.filter((page) =>
        (page.paragraphs ?? []).includes(lead)
      );
      const semanticLead = lead !== undefined
        && (/^###\\s/.test(lead) || /^\\*\\*[^*]+\\*\\*$/.test(lead) || lead.trim().endsWith(":"));
      richParts[marker] = {
        expectedPartCount,
        actualPartCount: parts.length,
        ordered: parts.every((page, index) =>
          page.richBlock.partIndex === index
          && page.richBlock.partCount === expectedPartCount
        ),
        markerCopies: owner.deck
          .flatMap((page) => page.paragraphs ?? [])
          .filter((paragraph) => paragraph === marker).length,
        leadCopies: leadPages.length,
        semanticLead,
        leadOnFirstPart: lead !== undefined
          && (parts[0]?.paragraphs ?? []).includes(lead),
      };
    }

    console.log(JSON.stringify({
      bookCount: decks.length,
      courageSource: courageSection.paragraphs.slice(0, 3),
      courageLeaf: courageLeaf.paragraphs,
      rescueLeafItemCounts: rescueLeaves.map((page) =>
        (page.paragraphs ?? []).filter((paragraph) => rescueChecklist.includes(paragraph)).length
      ),
      orphanRisks,
      terminalHeadingRisks,
      exactManuscripts,
      richParts,
    }));
  `);

  assert.equal(audit.bookCount, 9);
  assert.deepEqual(audit.courageLeaf, audit.courageSource);
  assert.deepEqual(audit.rescueLeafItemCounts, [4]);
  assert.deepEqual(audit.orphanRisks, []);
  assert.deepEqual(audit.terminalHeadingRisks, []);
  audit.exactManuscripts.forEach(({ slug, exact }) => {
    assert.equal(exact, true, `${slug} lost or reordered authored copy`);
  });
  Object.entries(audit.richParts).forEach(([marker, result]) => {
    assert.equal(result.actualPartCount, result.expectedPartCount, `${marker} part count`);
    assert.equal(result.ordered, true, `${marker} parts are out of order`);
    assert.equal(result.markerCopies, 1, `${marker} source marker must appear exactly once`);
    assert.equal(result.leadCopies, 1, `${marker} lead must remain readable exactly once`);
    assert.equal(
      result.leadOnFirstPart,
      result.semanticLead,
      `${marker} semantic lead must travel with part one`,
    );
  });
});
