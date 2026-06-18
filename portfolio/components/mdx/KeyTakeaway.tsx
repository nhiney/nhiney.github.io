import { ReactNode } from "react";

type Tone = "amber" | "sage" | "terracotta";

interface KeyTakeawayProps {
  children: ReactNode;
  /** Small uppercase eyebrow. Author writes it per language (omit for none). */
  label?: string;
  /** Warm tint of the card. Defaults to amber. */
  tone?: Tone;
}

/**
 * A magazine-style "key takeaway" callout for interleaving inside an article.
 *
 * Deliberately NOT a dev alert box: a soft warm tint + a single 2px accent edge
 * lift the most valuable line off the page without breaking the reading flow.
 * Pure presentational, so it renders inside the server-compiled MDX body.
 * All visuals live in `.book-callout` (see globals.css) and inherit the
 * surrounding `.book-page` palette, so it stays book-toned in light and dark.
 */
export function KeyTakeaway({ children, label, tone = "amber" }: KeyTakeawayProps) {
  return (
    <aside className="book-callout" data-tone={tone}>
      {label && <p className="book-callout-label">{label}</p>}
      <div className="book-callout-body">{children}</div>
    </aside>
  );
}
