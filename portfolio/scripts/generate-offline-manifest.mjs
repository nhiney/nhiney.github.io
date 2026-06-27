import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, relative, resolve, sep } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "out");
const BUILD_ID_PATH = resolve(ROOT, ".next/BUILD_ID");
const MANIFEST_PATH = resolve(OUT_DIR, "offline-manifest.js");

const CORE_FILES = new Set([
  "index.html",
  "404.html",
  "favicon.ico",
  "icon.png",
  "apple-icon.png",
  "manifest.webmanifest",
]);

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = resolve(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function toOutputRelativePath(filePath) {
  return relative(OUT_DIR, filePath).split(sep).join("/");
}

function toUrl(relativePath) {
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"index.html".length)}`;
  }
  return `/${relativePath}`;
}

function shouldPrecache(relativePath) {
  if (CORE_FILES.has(relativePath)) return true;
  if (relativePath.startsWith("_next/static/")) return true;
  if (relativePath === "offline/index.html") return true;
  if (relativePath === "blog/index.html" || relativePath === "blog/index.txt") return true;
  if (relativePath.startsWith("blog/") && /\.(?:html|txt)$/i.test(relativePath)) return true;
  return false;
}

if (!existsSync(OUT_DIR)) {
  console.warn("offline manifest: out/ does not exist, skipping");
  process.exit(0);
}

const files = walk(OUT_DIR);
const urls = files
  .map((file) => toOutputRelativePath(file))
  .filter(shouldPrecache)
  .map(toUrl)
  .sort();

urls.push("/offline-manifest.js");

const versionHash = createHash("sha256");
for (const file of files) {
  const relativePath = toOutputRelativePath(file);
  if (!shouldPrecache(relativePath)) continue;
  const stats = statSync(file);
  versionHash.update(relativePath);
  versionHash.update(String(stats.size));
  versionHash.update(String(Math.round(stats.mtimeMs)));
}

const buildId = existsSync(BUILD_ID_PATH)
  ? readFileSync(BUILD_ID_PATH, "utf8").trim()
  : "local";
const version = `${buildId}-${versionHash.digest("hex").slice(0, 12)}`;
const uniqueUrls = Array.from(new Set(urls));
const manifest = {
  version,
  precache: uniqueUrls,
};

writeFileSync(
  MANIFEST_PATH,
  `self.__OFFLINE_MANIFEST = ${JSON.stringify(manifest)};\n`,
);

console.log(`✓ offline cache manifest: ${uniqueUrls.length} URLs -> ${MANIFEST_PATH}`);
