# Blog cover illustrations

Drop one image per post here, named after its slug:

```
public/images/blog/<slug>.webp      (or .avif / .jpg / .png)
```

Example: `public/images/blog/do-it-badly-but-do-it.webp`

The site picks it up automatically — no code change needed:

- `lib/blog-cover.ts` looks for `<slug>.{webp,avif,jpg,jpeg,png}` at build time.
- If a file exists, it shows on the blog listing card and at the top of the
  article, and becomes the `og:image` for social sharing.
- If no file exists yet, a tasteful themed gradient fallback is shown instead
  (never a broken image, no layout shift).

## Generating images

Prompts and alt text for every post live in `lib/blog-image-prompt.mjs`
(per-tag generator + hand-written overrides). To review them or generate
images, run from `portfolio/`:

```bash
# Audit only — writes manifest.json + prints which posts still need an image
node scripts/generate-blog-images.mjs

# Free, local, no API: generates editorial SVG-based cover files
bun run generate:blog-covers:free

# Paid/API path: generate photorealistic covers with an image model
IMAGE_GENERATION_API_KEY=sk-... node scripts/generate-blog-images.mjs --generate
```

Recommended size: **1200×675 (16:9)**, target **< 300–500 KB**. Existing files
are skipped by default; pass `--force` to regenerate them.

## Art direction

> Realistic editorial lifestyle photography for a reflective personal blog.
> Warm natural light, quiet atmosphere, soft neutral colors, calm and thoughtful
> mood, minimal composition, subtle film grain — emotionally honest but not
> dramatic. No text, no logo, no watermark, no recognizable faces.
