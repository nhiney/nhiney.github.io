import assert from "node:assert/strict";
import test from "node:test";

import {
  assertNonDecreasing,
  parseWakaTimeBadge,
} from "./sync-wakatime.mjs";

test("parses the current WakaTime badge format", () => {
  const result = parseWakaTimeBadge(
    "<svg><text>1,134 hrs 26 mins</text></svg>",
  );

  assert.deepEqual(result, {
    hours: 1134,
    minutes: 26,
    totalMinutes: 68066,
  });
});

test("accepts singular units and an omitted minute value", () => {
  assert.deepEqual(parseWakaTimeBadge("<svg><text>1 hr</text></svg>"), {
    hours: 1,
    minutes: 0,
    totalMinutes: 60,
  });
});

test("deduplicates the badge shadow and foreground labels", () => {
  const result = parseWakaTimeBadge(
    "<svg><text>1,134 hrs 26 mins</text><text>1,134 hrs 26 mins</text></svg>",
  );

  assert.equal(result.totalMinutes, 68066);
});

test("rejects malformed totals", () => {
  assert.throws(
    () => parseWakaTimeBadge("<svg><text>coding time unavailable</text></svg>"),
    /recognizable total/,
  );
});

test("rejects a lower total", () => {
  assert.throws(
    () =>
      assertNonDecreasing(
        { totalMinutes: 68066 },
        { totalMinutes: 68065 },
      ),
    /Refusing to replace/,
  );
});
