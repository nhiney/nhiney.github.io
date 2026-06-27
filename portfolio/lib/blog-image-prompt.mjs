// @ts-check
/**
 * Single source of truth for blog illustration metadata.
 *
 * Pure data + string helpers (NO filesystem, NO React) so it can be imported by
 * server components, client components, AND the Node generation script alike.
 *
 * The art direction is deliberately consistent: realistic editorial lifestyle
 * photography, warm natural light, quiet and emotionally honest, everyday
 * objects, no text / logos / faces. Each post's scene is chosen from its tags
 * (the most visually specific tag wins) so the image reflects the article's
 * spirit instead of a literal reading of the title. Curated posts can override
 * the auto-generated prompt/alt via OVERRIDES below.
 */

import { COVERS as COVERS_1 } from "./blog-covers/batch-1.mjs";
import { COVERS as COVERS_2 } from "./blog-covers/batch-2.mjs";
import { COVERS as COVERS_3 } from "./blog-covers/batch-3.mjs";
import { COVERS as COVERS_4 } from "./blog-covers/batch-4.mjs";
import { COVERS as COVERS_5 } from "./blog-covers/batch-5.mjs";
import { COVERS as COVERS_6 } from "./blog-covers/batch-6.mjs";
import { COVERS as COVERS_7 } from "./blog-covers/batch-7.mjs";
import { COVERS as COVERS_8 } from "./blog-covers/batch-8.mjs";
import {
  BLOG_IMAGE_STYLE,
  buildStrictBlogImagePrompt,
  normalizeBlogImagePrompt,
} from "./blog-cover-prompt-template.mjs";

export { BLOG_IMAGE_STYLE };

/** Public folder where generated covers live, named after the post slug. */
export const BLOG_IMAGE_PUBLIC_DIR = "/images/blog";
export const BLOG_IMAGE_EXT = "webp";

/**
 * Intended cover path for a slug (existence is checked separately, server-side).
 * @param {string} slug
 */
export function expectedCoverPath(slug) {
  return `${BLOG_IMAGE_PUBLIC_DIR}/${slug}.${BLOG_IMAGE_EXT}`;
}

/**
 * Everyday-object scene per theme tag. Phrases read as the SUBJECT of an
 * editorial photo; keep them concrete, calm and face-free.
 * @type {Record<string, string>}
 */
const SCENE_BY_TAG = {
  Discipline: "a tidy morning desk with an open notebook and a short handwritten checklist, a pen resting mid-page",
  Habits: "a small daily ritual laid out on a calm desk — one notebook, one pen and a warm cup of tea",
  Consistency: "a few well-worn notebooks stacked beside a single fresh page, traces of small daily effort",
  Focus: "a closed laptop and a phone turned face-down beside one open notebook in natural light",
  Minimalism: "a nearly empty desk with a single object and generous empty space",
  Clarity: "a clean glass of water on a bare table by a bright window",
  Technology: "a closed laptop resting beside a notebook and a small plant, screens at rest in daylight",
  Money: "a tidy desk with a plain ledger notebook, a pen and a calculator in grounded morning light",
  Work: "a calm workspace with a notebook, a coffee and steady soft daylight",
  Letter: "a handwritten letter and a fountain pen on a wooden desk under warm lamplight",
  Communication: "an open handwritten letter and a pen on a wooden table in soft light",
  Boundaries: "two chairs set a comfortable distance apart in a softly lit room",
  Friendship: "two cups of tea on a table by a window, one gently pushed a little away",
  Love: "two cups side by side and a small handwritten note in warm gentle light",
  Family: "an old family photograph beside a cup of tea on a worn wooden table",
  Kindness: "a small handwritten note left beside a cup of tea on a table, a quiet gesture",
  "Imposter Syndrome": "a softly glowing laptop in a dim room late at night, a single hand resting near the keys",
  Rest: "an unmade bed in soft daylight with a book left face-down, permission to pause",
  Solitude: "a single chair beside a window in a calm, almost empty room",
  Silence: "a quiet empty room with soft light falling through one open window",
  Observation: "raindrops on a windowpane with a blurred quiet street beyond",
  Patience: "a small seedling sprouting in a pot on a sunlit windowsill",
  Healing: "soft morning light across a rumpled blanket and a half-open window",
  "Self Compassion": "warm hands wrapped around a cup of tea near a window, a gentle quiet moment",
  Resilience: "a pair of worn shoes by the door and a window after the rain, light returning",
  Perseverance: "a long quiet road at dawn seen from behind, footsteps continuing forward",
  Failure: "crumpled paper drafts and a corrected sketch on a desk, evidence of trying again",
  Creativity: "an open sketchbook with imperfect pencil drawings, an eraser and shavings in soft light",
  Books: "a small stack of books beside a cup of tea on a windowsill in warm light",
  Regret: "an old letter and a closed book in dim warm light",
  Achievement: "a finished, slightly empty desk with a cold cup of coffee in quiet evening light",
  Emotion: "a window streaked with rain at dusk, a cup cooling on the sill",
  Comparison: "a single cup of coffee by a window while distant city lights blur out of focus",
  "Letting Go": "an open window with a light curtain drifting gently outward",
  "Slow Living": "a quiet room with sheer curtains moving softly, plants and afternoon light",
  Mindfulness: "steam rising from a cup on a still table, attention resting on one small detail",
  Direction: "a small path forking through soft morning fog, seen from behind",
  Youth: "an open window onto a city at golden hour with an unfinished journal on the sill",
  Curiosity: "an open notebook full of sketches beside a window onto a wider view",
  Learning: "an open book and a notebook with margin notes in soft daylight",
  Humility: "a single modest cup beside an open notebook on a bare wooden table",
  Inspiration: "a wide window onto the sky at dusk, a notebook open to a fresh page",
  Identity: "an ordinary kitchen window in gentle morning light, simple everyday life",
  "Ordinary Life": "an ordinary kitchen table with a cup and fruit bowl in plain morning light",
  Freedom: "an open window and a light curtain with a wide bright sky beyond",
  Growth: "a small potted plant on a windowsill reaching toward soft daylight",
  "Self Worth": "a person seen from behind sitting calmly by a bright window",
  Reflection: "a window with soft daylight, a notebook and a cup left on a sill, a contemplative pause",
};

/** Default when none of a post's tags map to a scene. */
const DEFAULT_SCENE =
  "a calm desk beside a window with a notebook and a cup of tea in soft natural light";

/**
 * Tag selection order, most visually specific first, so generic tags like
 * Reflection / Growth / Self Worth don't dominate over a distinctive one.
 */
const TAG_PRIORITY = [
  "Letter", "Imposter Syndrome", "Money", "Technology", "Books", "Family",
  "Friendship", "Love", "Communication", "Boundaries", "Rest", "Solitude",
  "Silence", "Minimalism", "Focus", "Clarity", "Observation", "Patience",
  "Regret", "Achievement", "Emotion", "Failure", "Creativity", "Resilience",
  "Perseverance", "Healing", "Self Compassion", "Discipline", "Habits",
  "Consistency", "Comparison", "Letting Go", "Slow Living", "Mindfulness",
  "Direction", "Youth", "Curiosity", "Learning", "Humility", "Inspiration",
  "Kindness", "Identity", "Ordinary Life", "Freedom", "Self Worth", "Growth",
  "Reflection",
];

/**
 * Pick the most fitting scene for a post from its tags.
 * @param {string[]} [tags]
 */
export function pickScene(tags = []) {
  for (const tag of TAG_PRIORITY) {
    if (tags.includes(tag) && SCENE_BY_TAG[tag]) return SCENE_BY_TAG[tag];
  }
  for (const tag of tags) {
    if (SCENE_BY_TAG[tag]) return SCENE_BY_TAG[tag];
  }
  return DEFAULT_SCENE;
}

/**
 * Compose the full AI image prompt for a post (Subject → mood → style → negatives).
 * @param {string} title
 * @param {string[]} [tags]
 */
export function buildImagePrompt(title, tags = []) {
  const scene = pickScene(tags);
  return buildStrictBlogImagePrompt({
    scene: `a young person quietly interacting with ${scene}`,
    environment:
      "a small lived-in Vietnamese apartment or street-side corner with ordinary traces of daily life",
    idea: `the reflective emotional idea behind the personal essay "${title}"`,
    action:
      "their face turned partly away, pausing mid-gesture with honest and unposed body language",
    details:
      "a face-down phone, a half-finished drink, worn everyday objects, and soft signs that someone has just been there",
  });
}

/**
 * Short, natural alt text describing the IMAGE (not the article).
 * @param {string} title
 * @param {string[]} [tags]
 */
export function buildImageAlt(title, tags = []) {
  const scene = pickScene(tags);
  return `${scene.charAt(0).toUpperCase()}${scene.slice(1)}, in soft natural light.`;
}

/**
 * Per-post documentary cover prompts, merged from lib/blog-covers/*.mjs.
 * Each entry: { imagePrompt, imageAlt, imageConcept, needsRegeneration }. Covers
 * every post with a bespoke human, story-driven scene (no reused stock scenes).
 * @type {Record<string, { imagePrompt?: string, imageAlt?: string, imageConcept?: string, needsRegeneration?: boolean }>}
 */
export const OVERRIDES = {
  ...COVERS_1,
  ...COVERS_2,
  ...COVERS_3,
  ...COVERS_4,
  ...COVERS_5,
  ...COVERS_6,
  ...COVERS_7,
  ...COVERS_8,
};

/**
 * Coarse scene key used to pick a hand-drawn illustration for the cover
 * placeholder. Fewer buckets than SCENE_BY_TAG (one drawing per key), but still
 * clearly tied to the article's theme so the art is meaningful, not decorative.
 * @type {Record<string, string>}
 */
const SCENE_KEY_BY_TAG = {
  Letter: "letter", Family: "letter", Kindness: "letter", Communication: "letter",
  Books: "books", Learning: "books",
  Technology: "laptop", Focus: "laptop", Minimalism: "laptop", "Imposter Syndrome": "laptop", Clarity: "laptop",
  Money: "desk", Work: "desk", Discipline: "desk", Habits: "desk", Consistency: "desk", Creativity: "desk", Failure: "desk",
  Friendship: "two-cups", Love: "two-cups", Boundaries: "two-cups",
  Observation: "rain", Regret: "rain", Emotion: "rain", "Letting Go": "rain", Silence: "rain",
  Direction: "path", Perseverance: "path", Resilience: "path", Youth: "path", Inspiration: "path",
  Growth: "plant", "Slow Living": "plant", Patience: "plant",
  Curiosity: "plant", Freedom: "plant", "Ordinary Life": "plant", Identity: "plant",
  Mindfulness: "tea", Healing: "tea",
  "Self Worth": "tea", "Self Compassion": "tea", Rest: "tea", Comparison: "tea", Reflection: "tea",
  Solitude: "tea", Humility: "tea", Achievement: "tea",
};

const SCENE_KEY_PRIORITY = [
  "Letter", "Family", "Books", "Learning", "Technology", "Imposter Syndrome",
  "Focus", "Minimalism", "Money", "Friendship", "Love", "Boundaries",
  "Communication", "Observation", "Regret", "Emotion", "Letting Go", "Silence",
  "Direction", "Perseverance", "Resilience", "Youth", "Patience", "Healing",
  "Growth", "Slow Living", "Mindfulness", "Curiosity", "Rest", "Solitude",
  "Self Compassion", "Comparison", "Achievement", "Humility", "Self Worth",
  "Creativity", "Failure", "Discipline", "Habits", "Consistency", "Work",
  "Kindness", "Inspiration", "Clarity", "Freedom", "Identity", "Ordinary Life",
  "Reflection",
];

/**
 * Pick the illustration scene key for a post: "desk" | "laptop" | "plant" |
 * "tea" | "books" | "two-cups" | "rain" | "path" | "letter".
 * @param {string[]} [tags]
 */
export function pickSceneKey(tags = []) {
  for (const tag of SCENE_KEY_PRIORITY) {
    if (tags.includes(tag) && SCENE_KEY_BY_TAG[tag]) return SCENE_KEY_BY_TAG[tag];
  }
  for (const tag of tags) {
    if (SCENE_KEY_BY_TAG[tag]) return SCENE_KEY_BY_TAG[tag];
  }
  return "desk";
}

/**
 * Resolve the full image metadata for a post (override merged over generator).
 * @param {string} slug
 * @param {string} title
 * @param {string[]} [tags]
 */
export function getBlogImageMeta(slug, title, tags = []) {
  const o = OVERRIDES[slug] || {};
  const rawPrompt = o.imagePrompt || buildImagePrompt(title, tags);
  return {
    title,
    slug,
    coverImage: expectedCoverPath(slug),
    sceneKey: pickSceneKey(tags),
    imageAlt: o.imageAlt || buildImageAlt(title, tags),
    imagePrompt: o.imagePrompt
      ? normalizeBlogImagePrompt(slug, rawPrompt)
      : rawPrompt,
    imageConcept: o.imageConcept || "",
    imageStyle: BLOG_IMAGE_STYLE,
    needsRegeneration: o.needsRegeneration === true,
    curated: Boolean(OVERRIDES[slug]),
  };
}
