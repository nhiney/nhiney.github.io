/**
 * Topic grouping for the blog filter bar.
 *
 * Posts keep their original, granular `tags` in frontmatter — this layer only
 * groups those tags into a handful of large, human-friendly categories for the
 * main topic bar. Any tag that is not mapped to a group falls through to the
 * "More" menu, so no tag is ever lost.
 */

export interface TopicGroup {
  /** Stable slug used in the `?topic=` query param. */
  slug: string;
  /** i18n key for the localized label. */
  labelKey: string;
  /** English fallback label. */
  label: string;
  /** Original tag names this group collects (matched case/format-insensitively). */
  tags: string[];
}

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    slug: "self-healing",
    labelKey: "blogPage.groups.self_healing",
    label: "Self & Healing",
    tags: [
      "Self Worth",
      "Self-Compassion",
      "Healing",
      "Identity",
      "Emotion",
      "Imposter Syndrome",
      "Comparison",
      "Freedom",
    ],
  },
  {
    slug: "growth",
    labelKey: "blogPage.groups.growth",
    label: "Growth",
    tags: [
      "Growth",
      "Youth",
      "Direction",
      "Learning",
      "Curiosity",
      "Achievement",
      "Failure",
      "Patience",
      "Humility",
      "Perseverance",
      "Resilience",
    ],
  },
  {
    slug: "mindful-living",
    labelKey: "blogPage.groups.mindful_living",
    label: "Mindful Living",
    tags: [
      "Mindfulness",
      "Slow Living",
      "Letting Go",
      "Rest",
      "Solitude",
      "Silence",
      "Minimalism",
      "Clarity",
      "Ordinary Life",
      "Observation",
    ],
  },
  {
    slug: "relationships",
    labelKey: "blogPage.groups.relationships",
    label: "Relationships",
    tags: ["Boundaries", "Kindness", "Love", "Friendship", "Communication", "Family"],
  },
  {
    slug: "work-craft",
    labelKey: "blogPage.groups.work_craft",
    label: "Work & Craft",
    tags: [
      "Discipline",
      "Consistency",
      "Habits",
      "Focus",
      "Creativity",
      "Work",
      "Technology",
      "Money",
      "Inspiration",
    ],
  },
];

/**
 * Normalize a tag for comparison: lowercase and collapse separators, so that
 * "Self-Compassion" and "Self Compassion" are treated as the same tag.
 */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[\s\-_]+/g, " ").trim();
}

const TAG_TO_TOPIC: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const group of TOPIC_GROUPS) {
    for (const tag of group.tags) map.set(normalizeTag(tag), group.slug);
  }
  return map;
})();

/** The group slug a tag belongs to, or undefined when it is ungrouped. */
export function topicSlugForTag(tag: string): string | undefined {
  return TAG_TO_TOPIC.get(normalizeTag(tag));
}

/** Whether a tag belongs to a given topic group. */
export function isTagInTopic(tag: string, topicSlug: string): boolean {
  return TAG_TO_TOPIC.get(normalizeTag(tag)) === topicSlug;
}

/** Tags (from an existing list) that belong to no group — shown under "More". */
export function getUngroupedTags(tags: string[]): string[] {
  return tags.filter((tag) => !TAG_TO_TOPIC.has(normalizeTag(tag)));
}
