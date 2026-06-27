"use client";

// One book cover. If a real cover image is set (meta.cover, served from
// /public) it's shown as a photo; otherwise we render a clean editorial cover
// (Penguin/Vintage-style typographic design) from the book's palette — so even
// books without a photo look intentionally designed, not generic.

import type { BookMeta } from "@/data/books";
import Image from "next/image";

const SERIF = "Georgia, 'Times New Roman', serif";

export function CoverArt({ meta, title }: { meta: BookMeta; title: string }) {
  if (meta.cover) {
    return (
      <Image
        src={meta.cover}
        alt={title}
        width={640}
        height={960}
        sizes="(min-width: 1024px) 20vw, 45vw"
        draggable={false}
        className="h-full w-full select-none object-cover"
      />
    );
  }

  const base = `hsl(${meta.hue} ${meta.saturation}% ${meta.lightness}%)`;
  const deep = `hsl(${meta.hue} ${meta.saturation}% ${Math.max(10, meta.lightness - 14)}%)`;
  const clean = title.split("—")[0].split(":")[0].trim();

  return (
    <div
      className="flex h-full w-full select-none flex-col justify-between"
      style={{
        background: `linear-gradient(155deg, ${base}, ${deep})`,
        padding: "11% 9%",
        color: meta.foil,
      }}
    >
      <div style={{ borderTop: `1px solid ${meta.foil}`, opacity: 0.65 }} />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: "clamp(13px, 2.1vw, 23px)",
            lineHeight: 1.16,
            letterSpacing: "0.005em",
          }}
        >
          {clean}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ width: 26, height: 1, background: meta.foil, margin: "0 auto 9px", opacity: 0.7 }} />
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(9px, 1.1vw, 13px)",
            opacity: 0.9,
          }}
        >
          {meta.author}
        </div>
      </div>
    </div>
  );
}
