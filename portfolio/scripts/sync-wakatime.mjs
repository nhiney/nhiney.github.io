#!/usr/bin/env node

import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const WAKATIME_BADGE_URL =
  "https://wakatime.com/badge/user/018b36df-8ee8-4a94-ab54-fb3a76987a97.svg";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const portfolioDirectory = path.resolve(scriptDirectory, "..");
const outputPath = path.join(portfolioDirectory, "data", "wakatime.json");
const maximumBadgeBytes = 64 * 1024;
const requestTimeoutMs = 15_000;
const maximumAttempts = 3;

export function parseWakaTimeBadge(svg) {
  const normalizedSvg = svg.replaceAll("&nbsp;", " ");
  const labels = [
    ...normalizedSvg.matchAll(/<text\b[^>]*>([^<]+)<\/text>/gi),
  ].map((match) => match[1].trim());
  const totals = new Set(
    labels.filter((label) =>
      /^[\d,]+\s*(?:hrs?|hours?)(?:\s+\d+\s*(?:mins?|minutes?))?$/i.test(
        label,
      ),
    ),
  );

  if (totals.size === 0) {
    throw new Error("The WakaTime badge did not contain a recognizable total.");
  }

  if (totals.size > 1) {
    throw new Error("The WakaTime badge contained conflicting totals.");
  }

  const label = [...totals][0];
  const match = label.match(
    /^([\d,]+)\s*(?:hrs?|hours?)(?:\s+(\d+)\s*(?:mins?|minutes?))?$/i,
  );
  const hours = Number.parseInt(match[1].replaceAll(",", ""), 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);

  if (!Number.isSafeInteger(hours) || hours < 0) {
    throw new Error(`Invalid WakaTime hour value: ${match[1]}`);
  }

  if (!Number.isSafeInteger(minutes) || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid WakaTime minute value: ${match[2] ?? "0"}`);
  }

  return {
    hours,
    minutes,
    totalMinutes: hours * 60 + minutes,
  };
}

export function assertNonDecreasing(currentTotal, nextTotal) {
  if (currentTotal && nextTotal.totalMinutes < currentTotal.totalMinutes) {
    throw new Error(
      `Refusing to replace ${currentTotal.totalMinutes} minutes with the lower value ${nextTotal.totalMinutes}.`,
    );
  }
}

async function readCurrentTotal() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function writeTotal(data) {
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
}

async function fetchBadgeSvg() {
  let lastError;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const badgeUrl = new URL(WAKATIME_BADGE_URL);
      badgeUrl.searchParams.set("sync", `${Date.now()}-${attempt}`);

      const response = await fetch(badgeUrl, {
        headers: {
          Accept: "image/svg+xml",
          "Cache-Control": "no-cache",
          "User-Agent": "nhiney.github.io WakaTime sync",
        },
        signal: AbortSignal.timeout(requestTimeoutMs),
      });

      if (!response.ok) {
        throw new Error(
          `WakaTime badge request failed with HTTP ${response.status}.`,
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.toLowerCase().includes("image/svg+xml")) {
        throw new Error(`Unexpected WakaTime content type: ${contentType || "missing"}.`);
      }

      const svg = await response.text();
      if (Buffer.byteLength(svg, "utf8") > maximumBadgeBytes) {
        throw new Error("The WakaTime badge exceeded the 64 KB safety limit.");
      }

      if (!svg.includes("<svg")) {
        throw new Error("WakaTime returned a response that was not an SVG badge.");
      }

      return svg;
    } catch (error) {
      lastError = error;
      if (attempt < maximumAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
      }
    }
  }

  throw lastError;
}

export async function syncWakaTime() {
  const svg = await fetchBadgeSvg();
  const nextTotal = parseWakaTimeBadge(svg);
  const currentTotal = await readCurrentTotal();

  assertNonDecreasing(currentTotal, nextTotal);

  if (currentTotal && nextTotal.totalMinutes === currentTotal.totalMinutes) {
    console.log(
      `WakaTime is unchanged at ${nextTotal.hours} hours ${nextTotal.minutes} minutes.`,
    );
    return { changed: false, ...nextTotal };
  }

  const syncedTotal = {
    schemaVersion: 1,
    ...nextTotal,
    source: {
      provider: "WakaTime",
      url: WAKATIME_BADGE_URL,
      label: `${nextTotal.hours.toLocaleString("en-US")} hrs ${nextTotal.minutes} mins`,
    },
    observedAt: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  };

  await writeTotal(syncedTotal);
  console.log(
    `Updated WakaTime to ${syncedTotal.hours} hours ${syncedTotal.minutes} minutes.`,
  );

  return { changed: true, ...syncedTotal };
}

const isExecutedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isExecutedDirectly) {
  syncWakaTime().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
