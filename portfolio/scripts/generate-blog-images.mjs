/**
 * Blog cover image audit + generation.
 *
 *   node scripts/generate-blog-images.mjs            # audit only (default, safe)
 *   node scripts/generate-blog-images.mjs --generate # also generate missing covers
 *
 * Audit (always): reads every blog post's frontmatter, resolves its prompt/alt
 * from lib/blog-image-prompt.mjs, writes public/images/blog/manifest.json, and
 * prints which posts still need an image.
 *
 * Generate (--generate): for each post with NO existing cover file, calls an
 * image provider using the prompt and saves public/images/blog/<slug>.png.
 * The API key is read from the environment — never hard-coded, never committed.
 * Existing files are skipped, never overwritten.
 *
 * Env:
 *   IMAGE_GENERATION_API_KEY  (preferred)  or  OPENAI_API_KEY
 *   IMAGE_GENERATION_MODEL    (optional, default "gpt-image-1")
 */

import matter from "gray-matter";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { getBlogImageMeta } from "../lib/blog-image-prompt.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BLOG_DIR = resolve(ROOT, "content/blog");
const OUT_DIR = resolve(ROOT, "public/images/blog");
const MANIFEST = resolve(OUT_DIR, "manifest.json");
const LOCALE_VARIANT_RE = /\.(en|vi|ja|zh|es|fr|de|ko|ru|pt)\.mdx?$/;
const EXTS = ["webp", "avif", "jpg", "jpeg", "png"];

const shouldGenerate = process.argv.includes("--generate");
const API_KEY = process.env.IMAGE_GENERATION_API_KEY || process.env.OPENAI_API_KEY || "";
const MODEL = process.env.IMAGE_GENERATION_MODEL || "gpt-image-1";

mkdirSync(OUT_DIR, { recursive: true });

function existingCover(slug) {
  for (const ext of EXTS) {
    if (existsSync(resolve(OUT_DIR, `${slug}.${ext}`))) return `${slug}.${ext}`;
  }
  return null;
}

function readPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f) && !LOCALE_VARIANT_RE.test(f))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const { data } = matter(readFileSync(resolve(BLOG_DIR, file), "utf8"));
      const meta = getBlogImageMeta(slug, data.title ?? slug, data.tags ?? []);
      return {
        slug,
        title: data.title ?? slug,
        tags: data.tags ?? [],
        frontmatterImage: data.image ?? null,
        existing: existingCover(slug),
        ...meta,
      };
    });
}

/** Call the image provider for one prompt and return PNG bytes (Buffer). */
async function generateImage(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, prompt, size: "1536x1024", n: 1 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("provider returned no image data");
  return Buffer.from(b64, "base64");
}

async function main() {
  const posts = readPosts();
  const missing = posts.filter((p) => !p.existing && !p.frontmatterImage);
  // (Re)generate anything without a real file OR explicitly flagged for a redo
  // (e.g. covers made with the old object-only prompts before the documentary
  // direction). Posts with an explicit frontmatter image are always left alone.
  const toGenerate = posts.filter(
    (p) => !p.frontmatterImage && (!p.existing || p.needsRegeneration),
  );

  // Manifest = the reviewable audit (which posts have images, which prompts run).
  const manifest = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    coverImage: p.coverImage,
    imageAlt: p.imageAlt,
    imagePrompt: p.imagePrompt,
    imageConcept: p.imageConcept,
    imageStyle: p.imageStyle,
    needsRegeneration: p.needsRegeneration,
  }));
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`\nBlog cover audit — ${posts.length} posts`);
  console.log(`  has image      : ${posts.filter((p) => p.existing).length}`);
  console.log(`  missing        : ${missing.length}`);
  console.log(`  needs regen    : ${posts.filter((p) => p.needsRegeneration).length} (new documentary prompts)`);
  console.log(`  to (re)generate: ${toGenerate.length}`);
  console.log(`  curated        : ${posts.filter((p) => p.curated).length} hand-written prompts`);
  console.log(`  manifest       : public/images/blog/manifest.json\n`);

  if (!shouldGenerate) {
    console.log("Audit only. Re-run with --generate (and an API key) to create images.");
    if (toGenerate.length) {
      console.log("\nPosts to (re)generate:");
      for (const p of toGenerate) console.log(`  - ${p.slug}`);
    }
    return;
  }

  if (!API_KEY) {
    console.error(
      "\n--generate requested but no API key found.\n" +
        "Set IMAGE_GENERATION_API_KEY (or OPENAI_API_KEY) in the environment and re-run.\n" +
        "No image was generated; prompts and manifest are ready.",
    );
    process.exitCode = 1;
    return;
  }

  let ok = 0,
    fail = 0;
  for (const p of toGenerate) {
    try {
      const png = await generateImage(p.imagePrompt);
      writeFileSync(resolve(OUT_DIR, `${p.slug}.png`), png);
      ok++;
      console.log(`  ✓ ${p.slug}.png`);
    } catch (err) {
      fail++;
      console.error(`  ✗ ${p.slug}: ${err.message}`);
    }
  }
  console.log(`\nDone. generated ${ok}, failed ${fail}, skipped ${posts.length - missing.length}.`);
}

main().catch((err) => {
  console.error("blog image script failed:", err);
  process.exit(1);
});
