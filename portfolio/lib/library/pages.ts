// Builds the flipbook "deck" for a book: a fixed number of leaves the
// FlipBookReader turns through, Apple-Books style. Each book is normalised to
// PAGES_PER_BOOK leaves so the spread cadence is identical across the shelf —
// bump this constant later to give richer books more room (see the note in the
// detail overlay). The interior leaves are SEEDED from the book's written
// review when it has one, otherwise from its key points.

import type { BookPage } from "./types";
import { dacIllustrationWeight, parseDacIllustrationMarker } from "./dacIllustrations";
import type {
  BookReadingLayout,
  BookReadingPage,
  BookReadingTheme,
  LoopRestorationPageDesign,
} from "@/data/books";

/** How many leaves every book's flipbook has, for now. Title + interior + end. */
export const PAGES_PER_BOOK = 5;

/** Roughly how many characters comfortably fill one portrait reading leaf.
 * Kept conservative so prose doesn't overflow the fixed-height page; the rest
 * of a long review stays on the blog (the end leaf links to it). */
const PAGE_CHAR_BUDGET = 620;

/** Approximate rendered-size budget for curated content. Longer authored pages
 * continue onto another leaf so type never needs to shrink to an unreadable size. */
const CURATED_PAGE_CHAR_BUDGET = 1200;
const CURATED_RICH_PAGE_CHAR_BUDGET = 900;
const CURATED_DIAGRAM_PAGE_CHAR_BUDGET = 1100;
// A compact sectioned leaf is used by the Đắc Nhân Tâm edition. Its bespoke
// cards, paired columns and tighter paragraph rhythm can hold more authored
// material without shrinking the reading type. Illustration boxes still carry
// enough weight to begin on their own leaf when the lesson above is complete.
const CURATED_COMPACT_PAGE_CHAR_BUDGET = 620;
// These three editions keep their authored visual language on a dedicated
// physical leaf, while prose continues through normal page turns. This budget
// is roomy enough to avoid sparse two-sentence leaves, but still conservative
// enough for 17px Vietnamese copy on a portrait page.
// These full-page editorial editions render diagrams, labelled pairs and prose
// at the core reader's mobile type size. The old desktop-calibrated cap let
// several 366x509 leaves run past the paper edge.
const PLAIN_EDITORIAL_PAGE_CHAR_BUDGET = 400;
// The layered-time-map prose also contains pipe tables that become stacked
// definition cards on a phone, so each authored row needs a little more room.
const LAYERED_TIME_MAP_PAGE_CHAR_BUDGET = 330;
const PLAIN_EDITORIAL_THEMES = new Set<BookReadingTheme>([
  "breathing-house",
  "layered-time-map",
  "future-ethics-lab",
]);
const SILENCE_CASEFILE_PAGE_CHAR_BUDGET = 620;
const THINKING_DOSSIER_PAGE_CHAR_BUDGET = 580;
const POWER_BOARD_PAGE_CHAR_BUDGET = 620;
const POWER_BOARD_CARD_CHAR_BUDGET = 760;

// “Xưởng phục hồi” keeps the body at a true reading size (17px on a full
// 460×640 leaf), so authored chapters flow onto continuation leaves instead of
// turning each leaf into a scroll container. These values model vertical space,
// not raw characters: lists, tables, process diagrams, artwork and the writing
// field all reserve the height they actually need.
const LOOP_RESTORATION_PAGE_BUDGET = 500;
const LOOP_RESTORATION_FIGURE_WEIGHT = 150;
const LOOP_RESTORATION_NOTES_WEIGHT = 118;
const LOOP_RESTORATION_LIST_CHUNK_BUDGET = 240;
const LOOP_RESTORATION_FIGURE_BREAK_THRESHOLD = 340;

const LOOP_RESTORATION_FIGURE_AFTER: Record<LoopRestorationPageDesign, number> = {
  "ripple-butterfly": 2,
  "loop-break": 1,
  "culture-weave": 2,
  "responsibility-rings": 1,
  "fear-wall": 2,
  "achievement-mountain": 1,
  "love-control-knot": 0,
  "sound-memory-wave": 1,
  "threshold-today": 2,
  "repair-stages": 1,
  "forgiveness-gate": 0,
  "storm-checks": 1,
  "accountable-repair": 0,
  "seven-day-thread": 0,
};

/** Atomic Habits opts into a continuous print flow. The cap is deliberately
 * higher than the sectioned budget because compact leaves reclaim heading and
 * paragraph whitespace; semantic atoms still keep every visual and lead-in
 * together. */
// Some authored semantic atoms (a complete checklist plus its lead-in) are
// intentionally indivisible and approach 700 weight units. The cap admits one
// complete atom but prevents a dense closing paragraph joining it.
const CONTINUOUS_PAGE_CAP = 736;
const CONTINUOUS_TARGET_WEIGHT = 520;
const CONTINUOUS_SECTION_HEADING_WEIGHT = 150;
const CONTINUOUS_PARAGRAPH_RHYTHM_WEIGHT = 40;

// Two long perspectives end with a labelled reflection. Beginning their final
// semantic group on the next leaf avoids a large first page followed by only a
// heading and one sentence.
const POWER_BOARD_BALANCED_BREAKS = new Set([
  "### BA CÂU SOI LẠI SỰ IM LẶNG",
  "### KHI THẤU HIỂU PHẢI ĐI CÙNG RANH GIỚI",
]);

const CURATED_VISUAL_MARKERS = new Set([
  "[[identity-change-diagram]]",
  "[[habit-loop-diagram]]",
  "[[four-laws-practice-board]]",
  "[[seven-day-reading-table]]",
  "[[review-loop-diagram]]",
  "[[silent-progress-diagram]]",
  "[[preparation-action-table]]",
  "[[energy-levels-diagram]]",
  "[[kind-conversation-mindmap]]",
  "[[recognition-formula]]",
  "[[ethical-persuasion-table]]",
  "[[consent-traffic-light-table]]",
  "[[seven-day-care-table]]",
  "[[thinking-dossier-series]]",
  "[[thinking-film-album-comparison]]",
  "[[thinking-knowledge-gaps-table]]",
  "[[thinking-question-substitution-table]]",
  "[[thinking-decision-speed-matrix]]",
  "[[silence-casefile-series]]",
  "[[silence-observation-notes]]",
  "[[silence-courage-flow]]",
  "[[silence-interrogation-brief]]",
  "[[silence-evidence-table]]",
  "[[silence-evidence-loop]]",
  "[[silence-safety-formula]]",
  "[[silence-vulnerability-branch]]",
  "[[silence-power-map]]",
  "[[silence-help-table]]",
  "[[silence-fear-protocol]]",
  "[[power-board-series]]",
  "[[power-card-series]]",
  "[[power-practice-series]]",
  "[[power-compass]]",
  "[[power-reputation-table]]",
  "[[power-influence-formula]]",
  "[[power-values-flex-table]]",
  "[[power-value-dependency-diagram]]",
  "[[power-caution-spectrum-diagram]]",
  "[[power-position-mindmap]]",
  "[[power-plan-stop-diagram]]",
  "[[power-decision-console-diagram]]",
  "[[power-six-images-diagram]]",
  "[[power-change-flow-diagram]]",
  "[[power-victory-stop-diagram]]",
  "[[power-core-flex-mindmap]]",
  "[[power-scene-illustration:stage]]",
  "[[power-scene-illustration:coat]]",
  "[[power-scene-illustration:water]]",
  "[[power-scene-illustration:gift]]",
  "[[power-scene-illustration:shadow]]",
  "[[power-scene-illustration:knot]]",
]);

const CURATED_VISUAL_SOFT_CAP = 1.05;
const CURATED_VISUAL_SPARSE_FILL = 0.35;

/** Visuals in this list may deliberately follow a short contextual leaf:
 * either the complete intro + lead + object exceeds the 5% safety cap, or the
 * marker is an authored phase divider. Oversized rich-block parts are exempt
 * through `richBlockPartCount` and therefore do not need to be duplicated here. */
export const CURATED_VISUAL_LEAD_BREAK_ALLOWLIST = [
  "[[kind-conversation-mindmap]]",
  "[[consent-traffic-light-table]]",
  "[[silence-interrogation-brief]]",
  "[[silence-evidence-table]]",
  "[[silence-vulnerability-branch]]",
  "[[silence-fear-protocol]]",
  "[[power-board-series]]",
  "[[power-card-series]]",
  "[[power-practice-series]]",
  "[[power-compass]]",
] as const;

const CURATED_VISUAL_LEAD_BREAKS = new Set<string>(
  CURATED_VISUAL_LEAD_BREAK_ALLOWLIST,
);

const THINKING_VISUAL_MARKERS = new Set([
  "[[thinking-dossier-series]]",
  "[[thinking-film-album-comparison]]",
  "[[thinking-knowledge-gaps-table]]",
  "[[thinking-question-substitution-table]]",
  "[[thinking-decision-speed-matrix]]",
]);

/** Rich editorial objects that are taller than one narrow portrait leaf. They
 * keep normal reading type and continue through page turns instead of becoming
 * an inner scroll area or being clipped at the paper edge. */
const DAC_ILLUSTRATION_PART_COUNTS: Record<string, number> = {
  "deadline": 2,
  "child-recognition": 2,
  "friend-resignation": 3,
  "remember-detail": 2,
  "course-sale": 2,
  "money-disagreement": 3,
  "hesitant-overtime": 3,
  "invoice-mistake": 3,
  "safety-boundary": 3,
  "family-loan": 2,
  "sad-story": 3,
};

const RICH_BLOCK_PART_COUNTS: Record<string, number> = {
  "[[ethical-persuasion-table]]": 2,
  "[[seven-day-reading-table]]": 2,
  "[[seven-day-care-table]]": 2,
  "[[energy-levels-diagram]]": 1,
  "[[thinking-film-album-comparison]]": 1,
  "[[thinking-question-substitution-table]]": 2,
  "[[thinking-decision-speed-matrix]]": 2,
  "[[silence-help-table]]": 2,
  "[[power-values-flex-table]]": 2,
};

function richBlockPartCount(marker: string): number {
  const illustrationId = parseDacIllustrationMarker(marker);
  if (illustrationId) return DAC_ILLUSTRATION_PART_COUNTS[illustrationId] ?? 0;
  // A scene includes a full-width image and caption. On a phone it owns one
  // physical leaf while its authored explanation remains immediately before it.
  if (marker.startsWith("[[power-scene-illustration:")) return 1;
  return RICH_BLOCK_PART_COUNTS[marker] ?? 0;
}

function isCuratedVisualMarker(block: string | undefined): block is string {
  return !!block && (
    CURATED_VISUAL_MARKERS.has(block)
    || parseDacIllustrationMarker(block) !== null
  );
}

function canSoftKeepVisualMarker(block: string | undefined): block is string {
  return isCuratedVisualMarker(block)
    && richBlockPartCount(block) === 0
    && !CURATED_VISUAL_LEAD_BREAKS.has(block);
}

/** A short visual lead may borrow at most 5% of one leaf, but only when the
 * content already on that leaf occupies less than 35% of its normal budget.
 * Applying the same predicate before the lead and again before the marker
 * turns the old advisory look-ahead into a real two-block keep. */
function fitsSparseVisualSoftCap(
  currentWeightBeforeLead: number,
  leadWeight: number,
  visualWeight: number,
  pageBudget: number,
): boolean {
  return currentWeightBeforeLead < pageBudget * CURATED_VISUAL_SPARSE_FILL
    && leadWeight <= pageBudget * CURATED_VISUAL_SPARSE_FILL
    && currentWeightBeforeLead + leadWeight + visualWeight
      <= pageBudget * CURATED_VISUAL_SOFT_CAP;
}

interface CuratedAtom {
  sectionIndex: number;
  paragraphs: string[];
  weight: number;
  startsSection: boolean;
}

/** Rich blocks occupy more vertical space than their raw character count. */
function curatedBlockWeight(block: string): number {
  const illustrationId = parseDacIllustrationMarker(block);
  if (illustrationId) return dacIllustrationWeight(illustrationId);
  if (block === "[[identity-change-diagram]]") return 240;
  if (block === "[[habit-loop-diagram]]") return 380;
  if (block === "[[four-laws-practice-board]]") return 430;
  if (block === "[[seven-day-reading-table]]") return 560;
  if (block === "[[review-loop-diagram]]") return 300;
  if (block === "[[silent-progress-diagram]]") return 320;
  if (block === "[[preparation-action-table]]") return 500;
  if (block === "[[energy-levels-diagram]]") return 260;
  if (block === "[[kind-conversation-mindmap]]") return 560;
  if (block === "[[recognition-formula]]") return 300;
  // Reserve a little extra breathing room around the two widest Đắc Nhân Tâm
  // tables. Their closing takeaway then travels with the matching illustration
  // instead of being squeezed under the final row.
  if (block === "[[ethical-persuasion-table]]") return 675;
  if (block === "[[consent-traffic-light-table]]") return 595;
  if (block === "[[seven-day-care-table]]") return 520;
  if (block === "[[thinking-dossier-series]]") return 220;
  if (block === "[[thinking-film-album-comparison]]") return 360;
  if (block === "[[thinking-knowledge-gaps-table]]") return 420;
  if (block === "[[thinking-question-substitution-table]]") return 560;
  if (block === "[[thinking-decision-speed-matrix]]") return 650;
  // The Silence of the Lambs edition uses compact case-file components. Their
  // weights reflect rendered height rather than marker length so tables and
  // process diagrams are never mistaken for a nearly empty text line.
  if (block === "[[silence-casefile-series]]") return 220;
  if (block === "[[silence-observation-notes]]") return 400;
  if (block === "[[silence-courage-flow]]") return 320;
  if (block === "[[silence-interrogation-brief]]") return 420;
  if (block === "[[silence-evidence-table]]") return 500;
  if (block === "[[silence-evidence-loop]]") return 260;
  if (block === "[[silence-safety-formula]]") return 250;
  if (block === "[[silence-vulnerability-branch]]") return 460;
  if (block === "[[silence-power-map]]") return 440;
  if (block === "[[silence-help-table]]") return 540;
  if (block === "[[silence-fear-protocol]]") return 520;
  if (block === "[[power-board-series]]") return 235;
  if (block === "[[power-card-series]]") return 220;
  if (block === "[[power-practice-series]]") return 220;
  if (block.startsWith("[[power-round:")) return 150;
  if (block === "[[power-compass]]") return 580;
  if (block === "[[power-reputation-table]]") return 430;
  if (block === "[[power-influence-formula]]") return 250;
  if (block === "[[power-values-flex-table]]") return 560;
  if (block === "[[power-value-dependency-diagram]]") return 500;
  if (block === "[[power-caution-spectrum-diagram]]") return 480;
  if (block === "[[power-position-mindmap]]") return 500;
  if (block === "[[power-plan-stop-diagram]]") return 520;
  if (block === "[[power-decision-console-diagram]]") return 620;
  if (block === "[[power-six-images-diagram]]") return 560;
  if (block === "[[power-change-flow-diagram]]") return 470;
  if (block === "[[power-victory-stop-diagram]]") return 520;
  if (block === "[[power-core-flex-mindmap]]") return 600;
  if (block.startsWith("[[power-scene-illustration:")) return 250;
  if (block.startsWith("### ")) return block.length + 110;
  if (/^> \[(?:before|after|next)\]\s/.test(block)) return block.length + 110;
  if (block.startsWith("> ")) return block.length + 70;
  if (block.startsWith("- ")) return block.length + 40;
  if (/^\d+\.\s/.test(block)) return block.length + 46;
  // Pipe rows become stacked definition cards on narrow leaves. Reserve their
  // row padding instead of treating the separators as ordinary prose glyphs.
  if (/^\|.+\|$/.test(block.trim())) return block.length + 20;
  // A standalone bold label renders as its own h4 with vertical rhythm; raw
  // character count alone substantially underestimates its height.
  if (/^\*\*[^*]+\*\*$/.test(block)) return block.length + 55;
  return block.length;
}

function listBlockKind(block: string | undefined): "bullet" | "ordered" | null {
  if (block?.startsWith("- ")) return "bullet";
  if (block && /^\d+\.\s/.test(block)) return "ordered";
  return null;
}

const MAX_PLAIN_PROSE_SEGMENT = 250;

/** A printed paragraph may continue on the next leaf just as it would in a
 * physical book. Split only unformatted prose, retaining every character and
 * whitespace in order, so a narrow leaf never hides the end of a long
 * paragraph. Structured blocks remain atomic and use their own height weight. */
function splitLongPlainProse(block: string): string[] {
  if (
    block.length <= MAX_PLAIN_PROSE_SEGMENT
    || /^(?:###\s|>\s|-\s|\d+\.\s|\[\[|```|\|)/.test(block)
    || /(?:\*|_|==|`|\[[^\]]*\]\()/.test(block)
  ) {
    return [block];
  }

  const segments: string[] = [];
  let remaining = block;
  while (remaining.length > MAX_PLAIN_PROSE_SEGMENT) {
    const window = remaining.slice(0, MAX_PLAIN_PROSE_SEGMENT + 1);
    const sentenceBreaks = [...window.matchAll(/[.!?…][”’"']?\s+/g)];
    let preferred = sentenceBreaks
      .map((match) => (match.index ?? 0) + match[0].length)
      .filter((index) => index >= Math.floor(MAX_PLAIN_PROSE_SEGMENT * 0.55))
      .at(-1);
    // Avoid manufacturing a one-line tail (for example 249 + 13 characters),
    // which consumes a full paragraph margin and can overflow despite being
    // nearly empty. Prefer an earlier sentence or a balanced word boundary.
    if (preferred && remaining.length - preferred < 72) {
      preferred = sentenceBreaks
        .map((match) => (match.index ?? 0) + match[0].length)
        .filter((index) => (
          index >= Math.floor(MAX_PLAIN_PROSE_SEGMENT * 0.45)
          && remaining.length - index >= 72
        ))
        .at(-1);
    }
    const whitespace = window.lastIndexOf(" ");
    let splitAt = preferred ?? (whitespace > 0 ? whitespace + 1 : MAX_PLAIN_PROSE_SEGMENT);
    if (remaining.length - splitAt < 72) {
      const balancedTarget = Math.floor(remaining.length / 2);
      const balancedWhitespace = remaining.lastIndexOf(" ", balancedTarget);
      if (balancedWhitespace >= Math.floor(MAX_PLAIN_PROSE_SEGMENT * 0.4)) {
        splitAt = balancedWhitespace + 1;
      }
    }
    segments.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }
  if (remaining) segments.push(remaining);
  return segments;
}

function listRunBounds(blocks: string[], index: number) {
  const kind = listBlockKind(blocks[index]);
  if (!kind) return null;
  let start = index;
  let end = index;
  while (listBlockKind(blocks[start - 1]) === kind) start -= 1;
  while (listBlockKind(blocks[end + 1]) === kind) end += 1;
  return { start, end, length: end - start + 1 };
}

/** Keep a label/subheading with the block that explains it. */
function shouldKeepWithNext(block: string): boolean {
  const semanticText = block.replace(/^==|==$/g, "").trim();
  return block.startsWith("### ")
    || /^\*\*[^*]+\*\*$/.test(block)
    || semanticText.endsWith(":");
}

/** Index of the trailing semantic chain that must travel with the next block.
 * For example, both the subheading and its colon-ended list introduction move
 * together when the first list item would otherwise strand them on a leaf. */
function trailingKeepChainStart(blocks: string[]): number {
  let start = blocks.length;
  while (start > 0 && shouldKeepWithNext(blocks[start - 1])) start -= 1;
  return start;
}

function isPowerMoveHeading(block: string | undefined): boolean {
  return !!block && /^###\s+(?:Thẻ|Nước cờ)\s+\d+\s+—\s+/.test(block);
}

function powerMoveFollowingWeight(
  blocks: string[],
  index: number,
  blockWeight: (block: string) => number
): number {
  let total = 0;
  for (let cursor = index + 1; cursor < blocks.length; cursor += 1) {
    const candidate = blocks[cursor];
    if (candidate.startsWith("### ") || candidate.startsWith("[[power-round:")) break;
    total += blockWeight(candidate);
  }
  return total;
}

/** Reserve room for the content a heading introduces. Compact legends stay
 * together; longer working lists are allowed to flow into the free space. */
function keptFollowingWeight(
  blocks: string[],
  index: number,
  blockWeight: (block: string) => number,
  splitLongLists = false
): number {
  const block = blocks[index];
  const next = blocks[index + 1];
  if (!next) return 0;
  const afterNext = blocks[index + 2];

  if (block.startsWith("[[power-round:") && isPowerMoveHeading(next)) {
    return blockWeight(next) + powerMoveFollowingWeight(blocks, index + 1, blockWeight);
  }

  if (
    block === "[[power-board-series]]"
    || block === "[[power-card-series]]"
    || block === "[[power-practice-series]]"
    || block.startsWith("[[power-round:")
  ) {
    return blockWeight(next);
  }

  if (isPowerMoveHeading(block)) {
    return powerMoveFollowingWeight(blocks, index, blockWeight);
  }

  // A concluding visual should travel with the sentence that explains why it
  // matters, rather than becoming a nearly empty page by itself.
  if (CURATED_VISUAL_MARKERS.has(next)) {
    const visualWeight = blockWeight(next);
    if (THINKING_VISUAL_MARKERS.has(next) && afterNext) {
      return visualWeight + blockWeight(afterNext);
    }
    return visualWeight;
  }

  if (block === "[[thinking-dossier-series]]") return blockWeight(next);

  if (afterNext === "[[energy-levels-diagram]]") {
    return blockWeight(next) + blockWeight(afterNext);
  }

  if (!shouldKeepWithNext(block)) return 0;

  if (block.startsWith("### ") && afterNext?.startsWith("> ")) {
    return blockWeight(next) + blockWeight(afterNext);
  }
  if (
    block.startsWith("### ")
    && /^\*\*[^*]+\*\*$/.test(next)
    && afterNext
  ) {
    return blockWeight(next) + blockWeight(afterNext);
  }

  const nextListKind = listBlockKind(next);
  if (nextListKind && shouldKeepWithNext(block)) {
    const listBlocks: string[] = [];
    for (let cursor = index + 1; cursor < blocks.length; cursor += 1) {
      if (listBlockKind(blocks[cursor]) !== nextListKind) break;
      listBlocks.push(blocks[cursor]);
    }
    const keepCount = splitLongLists && listBlocks.length >= 6
      ? Math.floor(listBlocks.length / 2)
      : listBlocks.length;
    const listWeight = listBlocks
      .slice(0, keepCount)
      .reduce((weight, listBlock) => weight + blockWeight(listBlock), 0);
    const afterList = blocks[index + 1 + listBlocks.length];
    const closingWeight = splitLongLists
      && listBlocks.length < 6
      && index + 1 + listBlocks.length === blocks.length - 1
      && afterList
      ? blockWeight(afterList)
      : 0;
    return listWeight + closingWeight;
  }

  return blockWeight(next);
}

/** Last block index that must remain attached to `blocks[index]` in the
 * continuous layout. This is stricter than the legacy paginator: every visual
 * travels with its lead-in, while forms and labelled groups stay intact. */
function continuousKeepThrough(blocks: string[], index: number): number {
  const block = blocks[index];
  const next = blocks[index + 1];
  if (!next) return index;
  const afterNext = blocks[index + 2];

  if (CURATED_VISUAL_MARKERS.has(next)) return index + 1;
  if (afterNext === "[[energy-levels-diagram]]") return index + 2;

  // A checklist reads as one editorial object. Keep every consecutive item
  // together, including the short lead-in that introduces the list.
  if (block.startsWith("- ") && next.startsWith("- ")) {
    const run = listRunBounds(blocks, index);
    if (run && run.length >= 6) {
      const firstHalfEnd = run.start + Math.floor(run.length / 2) - 1;
      if (index < firstHalfEnd) return firstHalfEnd;
      if (index === firstHalfEnd) return index;
    }
    return run?.end ?? index + 1;
  }
  if (next.startsWith("- ") && shouldKeepWithNext(block)) {
    const run = listRunBounds(blocks, index + 1);
    if (run && run.length >= 6) {
      return run.start + Math.floor(run.length / 2) - 1;
    }
    return run?.end ?? index + 1;
  }

  if (!shouldKeepWithNext(block)) return index;

  if (block.startsWith("### ") && afterNext?.startsWith("> ")) {
    return index + 2;
  }
  if (
    block.startsWith("### ")
    && /^\*\*[^*]+\*\*$/.test(next)
    && afterNext
  ) {
    return index + 2;
  }
  if (
    next.startsWith("- ")
    && (
      /^\*\*[^*]+\*\*$/.test(block)
      || (block.startsWith("### ") && next.includes("...."))
    )
  ) {
    let end = index + 1;
    while (blocks[end + 1]?.startsWith("- ")) end += 1;
    return end;
  }

  return index + 1;
}

function continuousBlockWeight(page: BookReadingPage, block: string): number {
  const hasHabitLoop = page.paragraphs.includes("[[habit-loop-diagram]]");
  const hasReturnSteps = page.paragraphs.includes("### Cách quay lại sau một lần lỡ nhịp");
  const hasStructuredBoldBlocks = page.paragraphs.includes("[[energy-levels-diagram]]")
    || hasReturnSteps;

  const isPlainParagraph = !/^(###\s|>\s|-\s|\*\*[^*]+\*\*$|\[\[)/.test(block);

  return curatedBlockWeight(block)
    // Raw character count captures wrapping, but not the breathing room after
    // each prose paragraph. Modelling that rhythm prevents a leaf with many
    // short paragraphs from looking deceptively light to the paginator.
    + (isPlainParagraph ? CONTINUOUS_PARAGRAPH_RHYTHM_WEIGHT : 0)
    + (hasHabitLoop && /^\*\*[^*]+\*\*$/.test(block) ? 90 : 0)
    + (hasStructuredBoldBlocks && /^\*\*[^*]+\*\*$/.test(block) ? 70 : 0);
}

/** Convert authored paragraphs into semantic atoms. Break masks are applied
 * transitively, so overlapping heading/quote/visual relationships become one
 * indivisible unit without changing or duplicating authored text. */
function buildContinuousAtoms(readingPages: BookReadingPage[]): CuratedAtom[] {
  const atoms: CuratedAtom[] = [];

  readingPages.forEach((page, sectionIndex) => {
    const blocks = page.paragraphs;
    const canBreakAfter = blocks.map(() => true);

    blocks.forEach((_, index) => {
      const keepThrough = continuousKeepThrough(blocks, index);
      for (let cursor = index; cursor < keepThrough; cursor += 1) {
        canBreakAfter[cursor] = false;
      }
    });

    let start = 0;
    canBreakAfter.forEach((canBreak, index) => {
      if (!canBreak) return;
      const paragraphs = blocks.slice(start, index + 1);
      atoms.push({
        sectionIndex,
        paragraphs,
        weight: paragraphs.reduce(
          (total, block) => total + continuousBlockWeight(page, block),
          0
        ),
        startsSection: start === 0,
      });
      start = index + 1;
    });
  });

  return atoms;
}

/** Dynamic programming balances the whole book into the requested number of
 * leaves. It preserves source order, permits at most one inline section change
 * per leaf, and strongly penalises both sparse and over-dense leaves. */
function balanceContinuousAtoms(
  atoms: CuratedAtom[],
  requestedPages: number
): Array<[number, number]> | null {
  const atomCount = atoms.length;
  const pageCount = Math.min(requestedPages, atomCount);
  const scores = Array.from(
    { length: pageCount + 1 },
    () => Array<number>(atomCount + 1).fill(Number.POSITIVE_INFINITY)
  );
  const previous = Array.from(
    { length: pageCount + 1 },
    () => Array<number>(atomCount + 1).fill(-1)
  );
  scores[0][0] = 0;

  for (let usedPages = 0; usedPages < pageCount; usedPages += 1) {
    for (let start = 0; start < atomCount; start += 1) {
      const baseScore = scores[usedPages][start];
      if (!Number.isFinite(baseScore)) continue;

      let weight = 0;
      let inlineSectionCount = 0;
      let paragraphCount = 0;
      let paragraphsBeforeInlineSection = 0;
      let paragraphsAfterInlineSection = 0;
      for (let end = start; end < atomCount; end += 1) {
        weight += atoms[end].weight;
        if (end > start && atoms[end].startsSection) {
          inlineSectionCount += 1;
          paragraphsBeforeInlineSection = paragraphCount;
          paragraphsAfterInlineSection = 0;
          weight += CONTINUOUS_SECTION_HEADING_WEIGHT;
        }
        paragraphCount += atoms[end].paragraphs.length;
        if (inlineSectionCount > 0) {
          paragraphsAfterInlineSection += atoms[end].paragraphs.length;
        }
        if (inlineSectionCount > 1 || weight > CONTINUOUS_PAGE_CAP) break;

        // An inline chapter marker should reveal enough of the new section to
        // feel intentional, not leave a lone opening sentence at the foot of
        // the leaf. Keep at least two authored blocks below that marker; the
        // measured post-pass below owns one deliberate long-form exception.
        if (inlineSectionCount > 0 && paragraphsAfterInlineSection < 2) continue;

        const leavesRemaining = pageCount - usedPages - 1;
        const atomsRemaining = atomCount - end - 1;
        if (atomsRemaining < leavesRemaining) continue;
        if (leavesRemaining === 0 && atomsRemaining > 0) continue;

        const sparseThreshold = CONTINUOUS_TARGET_WEIGHT * 0.7;
        const denseThreshold = CONTINUOUS_TARGET_WEIGHT * 1.35;
        const sparsePenalty = weight < sparseThreshold
          ? 5 * (sparseThreshold - weight) ** 2
          : 0;
        const densePenalty = weight > denseThreshold
          ? 4 * (weight - denseThreshold) ** 2
          : 0;
        const transitionWidowPenalty = inlineSectionCount > 0
          && paragraphsBeforeInlineSection < 2
          ? 4 * (2 - paragraphsBeforeInlineSection) * 100_000
          : 0;
        const score = baseScore
          + (weight - CONTINUOUS_TARGET_WEIGHT) ** 2
          + sparsePenalty
          + densePenalty
          + transitionWidowPenalty;
        if (score >= scores[usedPages + 1][end + 1]) continue;

        scores[usedPages + 1][end + 1] = score;
        previous[usedPages + 1][end + 1] = start;
      }
    }
  }

  if (!Number.isFinite(scores[pageCount][atomCount])) return null;

  const ranges: Array<[number, number]> = [];
  let end = atomCount;
  for (let usedPages = pageCount; usedPages > 0; usedPages -= 1) {
    const start = previous[usedPages][end];
    if (start < 0) return null;
    ranges.unshift([start, end]);
    end = start;
  }
  return ranges;
}

function paginateContinuousCuratedPages(
  readingPages: BookReadingPage[],
  readingTheme?: BookReadingTheme,
): BookPage[] {
  const atoms = buildContinuousAtoms(readingPages);
  if (!atoms.length) return [];
  const sectionHeadingWeight = Math.max(0, readingPages.length - 1)
    * CONTINUOUS_SECTION_HEADING_WEIGHT;
  const totalWeight = atoms.reduce((sum, atom) => sum + atom.weight, 0)
    + sectionHeadingWeight;
  const targetPages = Math.max(
    readingPages.length,
    Math.ceil(totalWeight / CONTINUOUS_TARGET_WEIGHT)
  );
  const candidatePageCounts = [
    targetPages,
    targetPages + 1,
    targetPages + 2,
  ];
  const balancedRanges = candidatePageCounts
    .map((count) => balanceContinuousAtoms(atoms, count))
    .find((candidate): candidate is Array<[number, number]> => candidate !== null);

  if (!balancedRanges) {
    return paginateCuratedPages(readingPages, "sectioned", undefined, readingTheme);
  }
  const ranges = balancedRanges;

  const seenSections = new Set<number>();
  return ranges.map(([start, end], leafIndex) => {
    const leafAtoms = atoms.slice(start, end);
    const firstSection = leafAtoms[0].sectionIndex;
    const paragraphs: string[] = [];
    const sectionBreaks: NonNullable<BookPage["sectionBreaks"]> = [];
    let activeSection = firstSection;

    leafAtoms.forEach((atom) => {
      if (atom.sectionIndex !== activeSection) {
        activeSection = atom.sectionIndex;
        sectionBreaks.push({
          beforeParagraph: paragraphs.length,
          heading: readingPages[activeSection].heading,
        });
      }
      paragraphs.push(...atom.paragraphs);
    });

    const leaf: BookPage = {
      kind: "content",
      heading: readingPages[firstSection].heading,
      paragraphs,
      opening: leafIndex === 0,
      continuation: seenSections.has(firstSection),
      sectionBreaks: sectionBreaks.length ? sectionBreaks : undefined,
      density: "compact",
      theme: readingTheme,
    };
    leafAtoms.forEach((atom) => seenSections.add(atom.sectionIndex));
    return leaf;
  });
}

/** Turn a raw MDX/markdown review body into clean plain-text paragraphs. */
export function stripMarkdownToParagraphs(md: string): string[] {
  if (!md) return [];
  let text = md;

  // Drop fenced code blocks and any leftover frontmatter fence.
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/^---[\s\S]*?---/, "");

  const blocks: string[] = [];
  for (const rawBlock of text.split(/\n{2,}/)) {
    const lines = rawBlock
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      // Drop import/export and standalone JSX/MDX component lines.
      .filter((l) => !/^(import|export)\s/.test(l))
      .filter((l) => !/^<\/?[A-Za-z][^>]*>?$/.test(l));
    if (!lines.length) continue;

    let block = lines.join(" ");

    // Markdown → text: headings, list/quote markers, emphasis, links, images.
    block = block
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → text
      .replace(/^#{1,6}\s+/g, "") // heading hashes
      .replace(/^>\s?/g, "") // blockquote
      .replace(/^[-*+]\s+/g, "") // bullet markers
      .replace(/^\d+\.\s+/g, "") // ordered markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/(^|[\s(])\*([^*]+)\*/g, "$1$2")
      .replace(/(^|[\s(])_([^_]+)_/g, "$1$2")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (block) blocks.push(block);
  }
  return blocks;
}

/** Distribute paragraphs across up to `maxPages` leaves, each held to roughly
 * PAGE_CHAR_BUDGET so no leaf overflows. Paragraphs are never split mid-way;
 * once the budget runs out the remaining text is dropped (it lives on the blog). */
function paginate(paragraphs: string[], maxPages: number): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let count = 0;

  for (const p of paragraphs) {
    const wouldOverflow = count > 0 && count + p.length > PAGE_CHAR_BUDGET;
    if (wouldOverflow) {
      pages.push(current);
      if (pages.length >= maxPages) return pages;
      current = [];
      count = 0;
    }
    current.push(p);
    count += p.length;
  }
  if (current.length && pages.length < maxPages) pages.push(current);
  return pages;
}

type LoopRestorationAtom = {
  kind: "content" | "figure" | "notes";
  paragraphs: string[];
  weight: number;
  startIndex: number;
  endIndex: number;
};

function loopReadableText(value: string) {
  return value
    .replace(/^```text\n?|\n?```$/g, "")
    .replace(/^[->]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function loopLineCount(value: string, charactersPerLine = 44) {
  const text = loopReadableText(value);
  return Math.max(1, Math.ceil(text.length / charactersPerLine));
}

function loopParagraphWeight(value: string) {
  if (value.startsWith("```")) {
    const lines = loopReadableText(value).split("\n").filter((line) => line.trim());
    return 28 + lines.reduce(
      (height, line) => height + loopLineCount(line, 34) * 20,
      0
    );
  }
  if (value.startsWith("> ")) return 34 + loopLineCount(value, 40) * 27;
  if (/^\*\*[^*]+\*\*:?$/.test(value)) return 42;
  return 14 + loopLineCount(value) * 28;
}

function loopListItemWeight(value: string) {
  return 16 + loopLineCount(value, 39) * 25;
}

function isLoopTableRow(value: string) {
  return value.startsWith("|") && value.endsWith("|");
}

function isLoopTableRule(value: string) {
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(value);
}

function loopTableWeight(rows: string[]) {
  const visibleRows = rows.filter((row) => !isLoopTableRule(row));
  return 24 + visibleRows.reduce((height, row, rowIndex) => {
    const cells = row.slice(1, -1).split("|").map((cell) => loopReadableText(cell));
    const rowLines = Math.max(
      1,
      ...cells.map((cell, cellIndex) => loopLineCount(cell, cellIndex === 0 ? 16 : 31))
    );
    return height + (rowIndex === 0 ? 30 : 18) + rowLines * 20;
  }, 0);
}

function isLoopListItem(value: string) {
  return value.startsWith("- ") || /^\d+\.\s/.test(value);
}

function loopListKind(value: string): "bullet" | "ordered" | null {
  if (value.startsWith("- ")) return "bullet";
  if (/^\d+\.\s/.test(value)) return "ordered";
  return null;
}

function buildLoopRestorationAtoms(paragraphs: string[]): LoopRestorationAtom[] {
  const atoms: LoopRestorationAtom[] = [];
  let index = 0;

  while (index < paragraphs.length) {
    const paragraph = paragraphs[index];

    if (isLoopTableRow(paragraph)) {
      const start = index;
      const rows: string[] = [];
      while (index < paragraphs.length && isLoopTableRow(paragraphs[index])) {
        rows.push(paragraphs[index]);
        index += 1;
      }
      atoms.push({
        kind: "content",
        paragraphs: rows,
        weight: loopTableWeight(rows),
        startIndex: start,
        endIndex: index - 1,
      });
      continue;
    }

    if (isLoopListItem(paragraph)) {
      const kind = loopListKind(paragraph);
      const run: Array<{ value: string; index: number; weight: number }> = [];
      while (
        index < paragraphs.length
        && loopListKind(paragraphs[index]) === kind
      ) {
        run.push({
          value: paragraphs[index],
          index,
          weight: loopListItemWeight(paragraphs[index]),
        });
        index += 1;
      }

      let chunk: typeof run = [];
      let chunkWeight = 12;
      const pushChunk = () => {
        if (!chunk.length) return;
        atoms.push({
          kind: "content",
          paragraphs: chunk.map((item) => item.value),
          weight: chunkWeight,
          startIndex: chunk[0].index,
          endIndex: chunk[chunk.length - 1].index,
        });
        chunk = [];
        chunkWeight = 12;
      };

      for (const item of run) {
        if (
          chunk.length > 0
          && chunkWeight + item.weight > LOOP_RESTORATION_LIST_CHUNK_BUDGET
        ) {
          pushChunk();
        }
        chunk.push(item);
        chunkWeight += item.weight;
      }
      pushChunk();
      continue;
    }

    atoms.push({
      kind: "content",
      paragraphs: [paragraph],
      weight: loopParagraphWeight(paragraph),
      startIndex: index,
      endIndex: index,
    });
    index += 1;
  }

  // Keep short lead-ins and editorial labels with the block they introduce.
  const grouped: LoopRestorationAtom[] = [];
  for (let atomIndex = 0; atomIndex < atoms.length; atomIndex += 1) {
    const atom = atoms[atomIndex];
    const source = atom.paragraphs[0] ?? "";
    const isLeadIn = atom.paragraphs.length === 1 && (
      /^\*\*[^*]+\*\*:?$/.test(source)
      || (source.length <= 90 && source.trim().endsWith(":"))
    );
    const next = atoms[atomIndex + 1];
    if (isLeadIn && next) {
      grouped.push({
        kind: "content",
        paragraphs: [...atom.paragraphs, ...next.paragraphs],
        weight: atom.weight + next.weight,
        startIndex: atom.startIndex,
        endIndex: next.endIndex,
      });
      atomIndex += 1;
    } else {
      grouped.push(atom);
    }
  }
  return grouped;
}

function paginateLoopRestorationPages(
  readingPages: BookReadingPage[],
  readingDensity?: BookPage["density"]
): BookPage[] {
  const leaves: BookPage[] = [];

  for (const authoredPage of readingPages) {
    const page: BookReadingPage = {
      ...authoredPage,
      paragraphs: authoredPage.paragraphs.flatMap(splitLongPlainProse),
    };
    const design = page.loopDesign;
    if (!design) continue;

    const pageBudget = LOOP_RESTORATION_PAGE_BUDGET;
    const figureAfter = LOOP_RESTORATION_FIGURE_AFTER[design];
    const semanticAtoms = buildLoopRestorationAtoms(page.paragraphs);
    const atoms: LoopRestorationAtom[] = [];
    let figureInserted = false;

    for (const atom of semanticAtoms) {
      atoms.push(atom);
      if (!figureInserted && figureAfter <= atom.endIndex) {
        atoms.push({
          kind: "figure",
          paragraphs: [],
          weight: LOOP_RESTORATION_FIGURE_WEIGHT,
          startIndex: figureAfter,
          endIndex: figureAfter,
        });
        figureInserted = true;
      }
    }

    if (!figureInserted) {
      atoms.push({
        kind: "figure",
        paragraphs: [],
        weight: LOOP_RESTORATION_FIGURE_WEIGHT,
        startIndex: page.paragraphs.length - 1,
        endIndex: page.paragraphs.length - 1,
      });
    }
    if (design === "seven-day-thread") {
      atoms.push({
        kind: "notes",
        paragraphs: [],
        weight: LOOP_RESTORATION_NOTES_WEIGHT,
        startIndex: page.paragraphs.length,
        endIndex: page.paragraphs.length,
      });
    }

    const chunks: LoopRestorationAtom[][] = [];
    let current: LoopRestorationAtom[] = [];
    let currentWeight = 0;

    const pushCurrent = () => {
      if (!current.length) return;
      chunks.push(current);
      current = [];
      currentWeight = 0;
    };

    for (const atom of atoms) {
      if (
        atom.kind === "figure"
        && currentWeight >= LOOP_RESTORATION_FIGURE_BREAK_THRESHOLD
      ) {
        pushCurrent();
      } else if (
        atom.kind === "figure"
        && current.length > 1
        && currentWeight + atom.weight > pageBudget
      ) {
        const carry = current.pop();
        if (carry) {
          currentWeight -= carry.weight;
          pushCurrent();
          current.push(carry);
          currentWeight = carry.weight;
        }
      } else if (
        current.length > 0
        && currentWeight + atom.weight > pageBudget
      ) {
        pushCurrent();
      }

      current.push(atom);
      currentWeight += atom.weight;
    }
    pushCurrent();

    chunks.forEach((chunk, leafIndex) => {
      const paragraphs: string[] = [];
      let localFigureAfter: number | undefined;
      let showNotes = false;

      for (const atom of chunk) {
        if (atom.kind === "content") paragraphs.push(...atom.paragraphs);
        if (atom.kind === "figure") localFigureAfter = paragraphs.length - 1;
        if (atom.kind === "notes") showNotes = true;
      }

      leaves.push({
        kind: "content",
        heading: page.heading,
        paragraphs,
        opening: leaves.length === 0,
        continuation: leafIndex > 0,
        density: readingDensity ?? "compact",
        theme: "loop-restoration-workshop",
        loopDesign: design,
        loopFigureAfter: localFigureAfter,
        loopShowNotes: showNotes,
      });
    });
  }

  return leaves;
}

/** Split curated pages into as many leaves as they need. Paragraphs stay intact
 * and the source heading is shown on the first leaf, then repeated with a
 * continuation marker on following leaves so mobile readers never lose context. */
function paginateCuratedPages(
  readingPages: BookReadingPage[],
  readingLayout: BookReadingLayout = "sectioned",
  readingDensity?: BookPage["density"],
  readingTheme?: BookReadingTheme
): BookPage[] {
  if (readingTheme === "loop-restoration-workshop") {
    return paginateLoopRestorationPages(readingPages, readingDensity);
  }

  if (readingLayout === "continuous") {
    return paginateContinuousCuratedPages(readingPages, readingTheme);
  }

  const leaves: BookPage[] = [];
  const usesPlainEditorialPagination = readingTheme !== undefined
    && PLAIN_EDITORIAL_THEMES.has(readingTheme);

  for (const [authoredPageIndex, authoredPage] of readingPages.entries()) {
    const sectionStart = leaves.length;
    const page: BookReadingPage = {
      ...authoredPage,
      paragraphs: authoredPage.paragraphs.flatMap(splitLongPlainProse),
    };
    let current: string[] = [];
    let count = 0;
    let leafInSection = 0;
    let powerCardsOnLeaf = 0;
    const authoredSection = readingTheme === "thinking-dossier"
      ? { index: authoredPageIndex + 1, total: readingPages.length }
      : undefined;
    const hasHabitLoop = page.paragraphs.includes("[[habit-loop-diagram]]");
    const hasReturnSteps = page.paragraphs.includes("### Cách quay lại sau một lần lỡ nhịp");
    const hasStructuredBoldBlocks = page.paragraphs.includes("[[energy-levels-diagram]]")
      || hasReturnSteps;
    const hasFeelingReflection = page.paragraphs.includes(
      "> Lúc này mình đang muốn cảm thấy điều gì?"
    );
    const hasSilentProgress = page.paragraphs.includes("[[silent-progress-diagram]]");
    const hasMemoryAppointment = page.paragraphs.includes(
      "> Sau khi **[việc mình vẫn làm]**, tại **[địa điểm]**, mình sẽ **[hành động nhỏ]**."
    );
    const hasNewDiagram = page.paragraphs.some((block) =>
      block === "[[silent-progress-diagram]]"
      || block === "[[energy-levels-diagram]]"
    );
    const hasDiagram = page.paragraphs.some((block) =>
      block === "[[identity-change-diagram]]"
      || block === "[[habit-loop-diagram]]"
      || block === "[[review-loop-diagram]]"
      || block === "[[silent-progress-diagram]]"
      || block === "[[energy-levels-diagram]]"
      || block === "[[kind-conversation-mindmap]]"
      || block === "[[consent-traffic-light-table]]"
      || block === "[[thinking-decision-speed-matrix]]"
    );
    const hasRichBlocks = readingTheme === "power-board" || page.paragraphs.some((block) =>
      /^(###\s|>\s|-\s|\d+\.\s|\*\*[^*]+\*\*$)/.test(block)
      || CURATED_VISUAL_MARKERS.has(block)
      || parseDacIllustrationMarker(block) !== null
      || block === "[[seven-day-reading-table]]"
      || block === "[[review-loop-diagram]]"
      || block === "[[silent-progress-diagram]]"
      || block === "[[preparation-action-table]]"
      || block === "[[energy-levels-diagram]]"
    );
    let pageBudget = hasDiagram
      ? CURATED_DIAGRAM_PAGE_CHAR_BUDGET
      : hasRichBlocks
        ? CURATED_RICH_PAGE_CHAR_BUDGET
        : CURATED_PAGE_CHAR_BUDGET;
    if (hasNewDiagram) pageBudget = CURATED_RICH_PAGE_CHAR_BUDGET;
    if (hasSilentProgress) pageBudget = 720;
    if (hasMemoryAppointment) pageBudget = 700;
    if (hasReturnSteps) pageBudget = 1020;
    if (hasFeelingReflection) pageBudget = 720;
    if (readingDensity === "compact") {
      pageBudget = CURATED_COMPACT_PAGE_CHAR_BUDGET;
    }
    if (usesPlainEditorialPagination) {
      pageBudget = readingTheme === "layered-time-map"
        ? LAYERED_TIME_MAP_PAGE_CHAR_BUDGET
        : PLAIN_EDITORIAL_PAGE_CHAR_BUDGET;
    }
    if (readingTheme === "silence-casefile") {
      pageBudget = SILENCE_CASEFILE_PAGE_CHAR_BUDGET;
    }
    if (readingTheme === "thinking-dossier") {
      pageBudget = THINKING_DOSSIER_PAGE_CHAR_BUDGET;
    }
    if (readingTheme === "power-board") {
      pageBudget = page.paragraphs.some((block) => isPowerMoveHeading(block))
        ? POWER_BOARD_CARD_CHAR_BUDGET
        : POWER_BOARD_PAGE_CHAR_BUDGET;
    }
    const blockWeight = (block: string) =>
      curatedBlockWeight(block)
      + (hasHabitLoop && /^\*\*[^*]+\*\*$/.test(block) ? 90 : 0)
      + (hasStructuredBoldBlocks && /^\*\*[^*]+\*\*$/.test(block) ? 70 : 0);

    const pushCurrent = () => {
      if (!current.length) return;
      leaves.push({
        kind: "content",
        heading: page.heading,
        paragraphs: current,
        opening: leaves.length === 0,
        continuation: leafInSection > 0,
        authoredSection,
        density: readingDensity,
        theme: readingTheme,
      });
      current = [];
      count = 0;
      powerCardsOnLeaf = 0;
      leafInSection += 1;
    };

    for (const [index, paragraph] of page.paragraphs.entries()) {
      const weight = blockWeight(paragraph);
      const nextWeight = keptFollowingWeight(
        page.paragraphs,
        index,
        blockWeight,
        readingTheme === "thinking-dossier"
          || readingTheme === "power-board"
          || readingTheme === "silence-casefile"
      );
      const activePageBudget = hasMemoryAppointment && leafInSection > 0
        ? 1000
        : pageBudget;
      const nextParagraph = page.paragraphs[index + 1];
      const previousParagraph = page.paragraphs[index - 1];
      const startsSparseVisualKeep = canSoftKeepVisualMarker(nextParagraph)
        && fitsSparseVisualSoftCap(
          count,
          weight,
          blockWeight(nextParagraph),
          activePageBudget,
        );
      const previousWeight = previousParagraph ? blockWeight(previousParagraph) : 0;
      const completesSparseVisualKeep = canSoftKeepVisualMarker(paragraph)
        && previousParagraph !== undefined
        && current[current.length - 1] === previousParagraph
        && fitsSparseVisualSoftCap(
          count - previousWeight,
          previousWeight,
          weight,
          activePageBudget,
        );
      const wouldOverflow = count > 0
        && count + weight + nextWeight > activePageBudget
        && !startsSparseVisualKeep
        && !completesSparseVisualKeep;
      const beginsPowerCard = isPowerMoveHeading(paragraph);
      const reachedPowerCardLimit = readingTheme === "power-board"
        && beginsPowerCard
        && powerCardsOnLeaf >= 1;
      const beginsBalancedPowerGroup = readingTheme === "power-board"
        && POWER_BOARD_BALANCED_BREAKS.has(paragraph);
      const previousListKind = listBlockKind(page.paragraphs[index - 1]);
      const listRun = listRunBounds(page.paragraphs, index);
      const balancedListBreak = (
        readingTheme === "thinking-dossier"
        || readingTheme === "power-board"
      )
        && listRun !== null
        && listRun.length >= 5
        && index - listRun.start === Math.floor(listRun.length / 2);
      const continuesList = !balancedListBreak
        && previousListKind !== null
        && previousListKind === listBlockKind(paragraph)
        && (
          readingTheme === undefined
          // Short labelled lists are one compact editorial object. Their
          // heading already reserved the whole run; do not split the final
          // item onto the diagram leaf during the second pagination pass.
          || (listRun !== null && listRun.length < 6)
        );
      if (beginsBalancedPowerGroup && current.length) {
        pushCurrent();
      } else if (reachedPowerCardLimit && current.length) {
        pushCurrent();
      } else if (balancedListBreak && current.length) {
        pushCurrent();
      } else if (wouldOverflow && !continuesList) {
        // A prior look-ahead may have admitted a heading and its introduction,
        // only for the following list/table content to reveal that the group
        // does not fit. Carry the whole trailing semantic chain forward rather
        // than leaving a heading alone at the foot of the previous leaf.
        const carryStart = trailingKeepChainStart(current);
        const carried = carryStart < current.length
          ? current.splice(carryStart)
          : [];
        if (carried.length) {
          count -= carried.reduce((total, block) => total + blockWeight(block), 0);
          powerCardsOnLeaf -= carried.filter(isPowerMoveHeading).length;
        }
        pushCurrent();
        if (carried.length) {
          current.push(...carried);
          count = carried.reduce((total, block) => total + blockWeight(block), 0);
          powerCardsOnLeaf = carried.filter(isPowerMoveHeading).length;
        }
      }
      current.push(paragraph);
      count += weight;
      if (beginsPowerCard) powerCardsOnLeaf += 1;
    }

    pushCurrent();

    // Restore the authored rich edition without restoring its old inner
    // scrollbar. Each chapter keeps one dedicated visual leaf; the complete
    // prose remains on the ordinary leaves produced above and turns naturally
    // when it needs more room.
    const hasBreathingVisual = readingTheme === "breathing-house" && page.design;
    const hasTimeMapVisual = readingTheme === "layered-time-map" && page.timeMapDesign;
    const hasFutureLabVisual = readingTheme === "future-ethics-lab" && page.futureLabDesign;
    if (hasBreathingVisual || hasTimeMapVisual || hasFutureLabVisual) {
      leaves.splice(sectionStart + 1, 0, {
        kind: "content",
        heading: page.heading,
        paragraphs: [],
        continuation: true,
        density: readingDensity,
        theme: readingTheme,
        design: page.design,
        timeMapDesign: page.timeMapDesign,
        futureLabDesign: page.futureLabDesign,
        visualOnly: true,
        visualSourceParagraphs: authoredPage.paragraphs,
      });
    }
  }

  return leaves;
}

function headingAtParagraph(page: BookPage, paragraphIndex: number): string | undefined {
  let heading = page.heading;
  for (const sectionBreak of page.sectionBreaks ?? []) {
    if (sectionBreak.beforeParagraph > paragraphIndex) break;
    heading = sectionBreak.heading;
  }
  return heading;
}

function sliceContentLeaf(page: BookPage, start: number, end: number): BookPage {
  const sectionBreaks = (page.sectionBreaks ?? [])
    .filter(({ beforeParagraph }) => beforeParagraph > start && beforeParagraph < end)
    .map(({ beforeParagraph, heading }) => ({
      beforeParagraph: beforeParagraph - start,
      heading,
    }));

  return {
    ...page,
    heading: headingAtParagraph(page, start),
    paragraphs: (page.paragraphs ?? []).slice(start, end),
    opening: page.opening && start === 0,
    continuation: start > 0 || page.continuation,
    sectionBreaks: sectionBreaks.length ? sectionBreaks : undefined,
    richBlock: undefined,
  };
}

/** Split only the few rendered objects whose own rows exceed one phone leaf.
 * Authored prose is never removed or rewritten: the source marker remains once
 * on part one, while continuation leaves carry presentation metadata only. */
function expandOversizedRichBlocks(leaves: BookPage[]): BookPage[] {
  return leaves.flatMap((page) => {
    if (page.kind !== "content" || !page.paragraphs?.length) return [page];
    const paragraphs = page.paragraphs;

    const expanded: BookPage[] = [];
    let cursor = 0;
    let foundRichBlock = false;

    paragraphs.forEach((marker, paragraphIndex) => {
      const partCount = richBlockPartCount(marker);
      if (!partCount) return;
      foundRichBlock = true;

      // A semantic lead belongs to the object it introduces. Carry a trailing
      // subheading/label onto part one instead of manufacturing a heading-only
      // leaf immediately before the table or illustration.
      const leadStart = Math.max(
        cursor,
        trailingKeepChainStart(paragraphs.slice(cursor, paragraphIndex)) + cursor,
      );
      const leadParagraphs = paragraphs.slice(leadStart, paragraphIndex);

      if (leadStart > cursor) {
        expanded.push(sliceContentLeaf(page, cursor, leadStart));
      }

      const heading = headingAtParagraph(page, paragraphIndex);
      for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
        expanded.push({
          ...page,
          heading,
          paragraphs: partIndex === 0 ? [...leadParagraphs, marker] : [],
          opening: page.opening && leadStart === 0 && partIndex === 0,
          continuation: leadStart > 0 || partIndex > 0 || page.continuation,
          sectionBreaks: undefined,
          richBlock: { marker, partIndex, partCount },
        });
      }
      cursor = paragraphIndex + 1;
    });

    if (!foundRichBlock) return [page];
    if (cursor < paragraphs.length) {
      expanded.push(sliceContentLeaf(page, cursor, paragraphs.length));
    }
    return expanded;
  });
}

/** Split items into `n` contiguous, front-loaded groups, preserving order.
 * e.g. spread([0,1,2,3,4], 3) → [[0,1],[2,3],[4]]. */
function spread<T>(items: T[], n: number): T[][] {
  const groups: T[][] = [];
  const base = Math.floor(items.length / n);
  let rem = items.length % n;
  let idx = 0;
  for (let g = 0; g < n; g++) {
    const size = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem--;
    groups.push(items.slice(idx, idx + size));
    idx += size;
  }
  return groups;
}

/** Build a deck of exactly PAGES_PER_BOOK leaves: title · interior · end. The
 * deck holds only content (paragraphs / key-point items); the reader supplies
 * all localized chrome (title-leaf masthead, "Key ideas" label, end-leaf CTA),
 * so a deck built at build time stays correct under any UI language. */
export function buildDeck(
  reviewBody: string | undefined,
  keyPoints: string[],
  readingPages?: BookReadingPage[],
  readingLayout: BookReadingLayout = "sectioned",
  readingDensity?: BookPage["density"],
  readingTheme?: BookReadingTheme
): BookPage[] {
  // Curated reading pages drive the WHOLE deck (title · pages · end), so each
  // book can run as long or short as its content needs — bump or trim the
  // `readingPages` array per book to add/remove leaves.
  if (readingPages?.length) {
    const leaves = expandOversizedRichBlocks(
      paginateCuratedPages(
        readingPages,
        readingLayout,
        readingDensity,
        readingTheme
      )
    );
    return [{ kind: "cover" }, ...leaves, { kind: "end" }];
  }

  // Otherwise normalise to a fixed PAGES_PER_BOOK so books without curated pages
  // keep an identical spread cadence across the shelf.
  const interiorCount = Math.max(1, PAGES_PER_BOOK - 2);
  const interior: BookPage[] = [];

  const paragraphs = reviewBody ? stripMarkdownToParagraphs(reviewBody) : [];

  if (paragraphs.length) {
    const pages = paginate(paragraphs, interiorCount);
    pages.forEach((paras, i) =>
      interior.push({ kind: "content", paragraphs: paras, opening: i === 0 })
    );
  } else if (keyPoints.length) {
    // No written review yet — spread the key ideas across the interior leaves so
    // every page carries something (a few ideas per page), rather than one dense
    // list followed by blanks.
    const groups = spread(keyPoints, interiorCount);
    let offset = 0;
    groups.forEach((items, i) => {
      if (items.length) interior.push({ kind: "list", items, start: offset, opening: i === 0 });
      offset += items.length;
    });
  }

  // Pad to exactly interiorCount with blank leaves so the spread cadence holds.
  while (interior.length < interiorCount) interior.push({ kind: "content", paragraphs: [] });
  interior.length = interiorCount;

  return [{ kind: "cover" }, ...interior, { kind: "end" }];
}
