// @ts-check

export const BLOG_IMAGE_STYLE =
  "Ultra realistic candid documentary lifestyle photography, warm natural light, cinematic realism, Vietnamese/Asian urban life atmosphere when suitable, subtle film grain, emotionally honest human moment, no text, no logo, no watermark.";

const PROMPT_PREFIX =
  "Ultra realistic candid documentary lifestyle photography of ";

const PROMPT_STYLE_SENTENCE =
  "Warm natural light, cinematic realism, 35mm photography, shallow depth of field, natural skin texture, subtle film grain, imperfect real-life composition, emotionally quiet but deeply human.";

const PROMPT_NEGATIVE_SENTENCE =
  "No text, no logo, no watermark, no brand names, no celebrity, no recognizable face, no corporate stock photo, no cartoon, no 3D render.";

const DEFAULT_IDEA =
  "an emotionally honest turning point in ordinary young adult life";

/** @type {Record<string, string>} */
const IDEA_BY_SLUG = {
  "the-noise-i-learned-to-love":
    "learning to hear city noise as proof of ordinary life moving around you",
  "the-overthinking-brain-at-2am":
    "the private restlessness of an overthinking mind that cannot switch off at night",
  "the-power-of-a-terrible-first-draft":
    "the courage to begin with something rough instead of waiting for perfection",
  "the-quiet-art-of-not-caring":
    "protecting inner peace by refusing to absorb every careless opinion",
  "the-quiet-power-of-doing-less":
    "finding strength in doing less, pausing, and choosing only what matters",
  "the-rain-that-soaked-my-plans":
    "accepting the sudden collapse of a plan without losing yourself",
  "the-rejection-that-saved-me":
    "the quiet relief of realizing a rejection may have protected your path",
  "the-right-to-change-your-mind":
    "making peace with an older self and allowing your views to grow",
};

/** @type {Record<string, string>} */
const ENVIRONMENT_BY_SLUG = {
  "the-fire-and-the-ashes":
    "a small apartment living room in dim warm evening light after an argument",
  "the-worst-one-in-the-room":
    "the back row of a crowded innovation-hub auditorium with a bright stage far ahead",
};

/**
 * @param {unknown} value
 */
function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .replace(/^and\s+/i, "")
    .trim()
    .replace(/[.。]+$/g, "");
}

/**
 * @param {string} value
 */
function splitActionAndDetails(value) {
  const text = clean(value)
    .replace(/^meaningful everyday details:\s*/i, "")
    .replace(/^honest details\s*[—:-]\s*/i, "");

  const markers = [
    ", and meaningful everyday details:",
    ", and honest details:",
    ", and grounding details:",
    ", with honest details",
    ", plus honest details",
    ", and a ",
    ", with a ",
  ];

  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index > 0) {
      const action = clean(text.slice(0, index));
      const details = clean(text.slice(index + marker.length));
      if (action && details) return { action, details };
    }
  }

  const parts = text.split(/,\s+/);
  if (parts.length > 1) {
    return {
      action: clean(parts.shift()),
      details: clean(parts.join(", ")),
    };
  }

  return {
    action: text,
    details: "small lived-in details that make the moment feel real",
  };
}

/**
 * Build the only allowed prompt shape for blog cover generation.
 * @param {{ scene: string, environment: string, idea: string, action: string, details: string }} input
 */
export function buildStrictBlogImagePrompt(input) {
  return `${PROMPT_PREFIX}${clean(input.scene)}, set in ${clean(input.environment)}, representing ${clean(input.idea)}. The scene includes ${clean(input.action)} and ${clean(input.details)}. ${PROMPT_STYLE_SENTENCE} ${PROMPT_NEGATIVE_SENTENCE}`;
}

/**
 * Convert older curated prompts into the strict editorial template while keeping
 * each post's specific scene, environment, emotion, action, and everyday details.
 * @param {string} slug
 * @param {string} prompt
 */
export function normalizeBlogImagePrompt(slug, prompt) {
  const source = String(prompt ?? "").trim();
  if (!source.startsWith(PROMPT_PREFIX)) return source;

  const withoutPrefix = source.slice(PROMPT_PREFIX.length);
  const core = withoutPrefix
    .split(/\.\s+(?:Warm|Cool|Soft|Low|Natural|Golden-hour|Warm lamp|Warm gentle|Warm kitchen|Warm low|Warm desk|Cool low)/)[0]
    .trim();

  const match = core.match(
    /^([\s\S]*?), set (?:in|inside|on|at) ([\s\S]*?)(?:, representing ([\s\S]*?))?\. The scene includes ([\s\S]*)$/,
  );

  if (!match) {
    const fallback = core.match(
      /^([\s\S]*?), representing ([\s\S]*?)\. The scene includes ([\s\S]*)$/,
    );
    if (!fallback) return source;

    const [, scene, idea, includeText] = fallback;
    const { action, details } = splitActionAndDetails(includeText);
    return buildStrictBlogImagePrompt({
      scene,
      environment: ENVIRONMENT_BY_SLUG[slug] || "the real-life setting described in the scene",
      idea: idea || IDEA_BY_SLUG[slug] || DEFAULT_IDEA,
      action,
      details,
    });
  }

  const [, scene, environment, ideaFromPrompt, includeText] = match;
  const { action, details } = splitActionAndDetails(includeText);

  return buildStrictBlogImagePrompt({
    scene,
    environment,
    idea: ideaFromPrompt || IDEA_BY_SLUG[slug] || DEFAULT_IDEA,
    action,
    details,
  });
}

/**
 * @param {string} prompt
 */
export function isStrictBlogImagePrompt(prompt) {
  return (
    prompt.startsWith(PROMPT_PREFIX) &&
    prompt.includes(", set in ") &&
    prompt.includes(", representing ") &&
    prompt.includes(". The scene includes ") &&
    prompt.includes(`. ${PROMPT_STYLE_SENTENCE} ${PROMPT_NEGATIVE_SENTENCE}`)
  );
}
