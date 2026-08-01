import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const errors = [];
const localEnvPath = fileURLToPath(new URL("../.env.local", import.meta.url));

if (!process.argv.includes("--no-local-env") && existsSync(localEnvPath)) {
  const explicitKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const explicitHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  try {
    process.loadEnvFile(localEnvPath);
  } catch {
    errors.push("portfolio/.env.local could not be parsed.");
  }

  // Explicit shell/CI values take precedence over local developer defaults.
  if (explicitKey !== undefined) process.env.NEXT_PUBLIC_POSTHOG_KEY = explicitKey;
  if (explicitHost !== undefined) process.env.NEXT_PUBLIC_POSTHOG_HOST = explicitHost;
}

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ?? "";

const placeholderPattern = /(?:your[_-]?project|placeholder|replace[_-]?me|change[_-]?me|example)/i;

if (!key) {
  errors.push(
    "NEXT_PUBLIC_POSTHOG_KEY is missing. Set it as a GitHub Actions repository variable."
  );
} else if (placeholderPattern.test(key) || !/^phc_[A-Za-z0-9_-]{20,}$/.test(key)) {
  errors.push(
    "NEXT_PUBLIC_POSTHOG_KEY is invalid or still a placeholder. Expected a public project key beginning with phc_."
  );
}

if (!host) {
  errors.push(
    "NEXT_PUBLIC_POSTHOG_HOST is missing. Set it as a GitHub Actions repository variable."
  );
} else {
  try {
    const parsedHost = new URL(host);
    const hasUnsupportedParts =
      parsedHost.protocol !== "https:" ||
      !parsedHost.hostname ||
      Boolean(parsedHost.username) ||
      Boolean(parsedHost.password) ||
      Boolean(parsedHost.search) ||
      Boolean(parsedHost.hash);

    if (hasUnsupportedParts || placeholderPattern.test(parsedHost.hostname)) {
      errors.push(
        "NEXT_PUBLIC_POSTHOG_HOST is invalid. Expected an HTTPS PostHog ingestion URL without credentials, query parameters, or a fragment."
      );
    }
  } catch {
    errors.push(
      "NEXT_PUBLIC_POSTHOG_HOST is invalid. Expected an absolute HTTPS PostHog ingestion URL."
    );
  }
}

if (errors.length > 0) {
  console.error("PostHog build environment validation failed (values redacted):");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("PostHog build environment is valid (values redacted).");
}
