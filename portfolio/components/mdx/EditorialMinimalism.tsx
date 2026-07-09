import { ReactNode } from "react";
import { Be_Vietnam_Pro, Merriweather } from "next/font/google";

interface EditorialProps {
  children: ReactNode;
}

interface EditorialHighlightBoxProps extends EditorialProps {
  title: string;
}

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-atomic-body",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-atomic-serif",
  display: "swap",
});

const serifStack = 'var(--font-atomic-serif), "Merriweather", Georgia, "Times New Roman", serif';
const bodyStack = 'var(--font-atomic-body), "Be Vietnam Pro", var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export function EditorialArticle({ children }: EditorialProps) {
  return (
    <section className={`atomic-editorial-minimalism ${beVietnamPro.variable} ${merriweather.variable}`}>
      <style>{`
        .book-page:has(.atomic-editorial-minimalism) {
          --ink: #6D5D50;
          --ink-soft: #6D5D50;
          --ink-faint: rgba(109, 93, 80, 0.74);
          --accent-ink: #3A4D39;
          --rule: rgba(58, 77, 57, 0.28);
          --rule-soft: rgba(58, 77, 57, 0.18);
          background: #FDFBF7;
          color: #6D5D50;
        }

        .book-page:has(.atomic-editorial-minimalism) .book-title,
        .book-page:has(.atomic-editorial-minimalism) .book-lead {
          letter-spacing: 0;
        }

        .book-page:has(.atomic-editorial-minimalism) .book-title {
          color: #3A4D39;
          font-family: ${serifStack};
        }

        .book-page:has(.atomic-editorial-minimalism) .book-lead,
        .book-page:has(.atomic-editorial-minimalism) .book-byline,
        .book-page:has(.atomic-editorial-minimalism) .book-meta {
          color: #6D5D50;
          font-family: ${bodyStack};
        }

        .book-page:has(.atomic-editorial-minimalism) > .mt-10 {
          margin-inline: auto;
          max-width: 30rem;
          padding-block: 2rem;
          border-block: 1px solid rgba(58, 77, 57, 0.15);
        }

        .book-page:has(.atomic-editorial-minimalism) > .mt-10 > div {
          border-color: rgba(58, 77, 57, 0.2);
          border-radius: 8px;
          background: #F4EFEA;
          box-shadow: 0 18px 45px rgba(109, 93, 80, 0.08);
        }

        .post-content .atomic-editorial-minimalism {
          --atomic-cream: #FDFBF7;
          --atomic-warm-brown: #6D5D50;
          --atomic-moss: #3A4D39;
          --atomic-paper: #F4EFEA;
          --atomic-line: rgba(58, 77, 57, 0.18);
          margin-inline: clamp(-1rem, -2vw, -0.25rem);
          padding: clamp(1.5rem, 3vw, 2.75rem);
          border: 1px solid var(--atomic-line);
          border-radius: 8px;
          background: var(--atomic-cream);
          color: var(--atomic-warm-brown);
          font-family: ${bodyStack};
        }

        .post-content .atomic-editorial-minimalism p {
          margin: 0;
          color: var(--atomic-warm-brown);
          font-family: ${bodyStack};
          font-size: clamp(1.02rem, 0.98rem + 0.18vw, 1.12rem);
          font-weight: 400;
          line-height: 1.95;
          text-align: left;
          text-wrap: pretty;
        }

        .post-content .atomic-editorial-minimalism p + p {
          margin-top: 2.15rem;
        }

        .post-content .atomic-editorial-minimalism h2 {
          display: block;
          margin: 4rem 0 1.35rem;
          padding: 0;
          border: 0;
          color: var(--atomic-moss);
          font-family: ${serifStack};
          font-size: clamp(1.65rem, 1.25rem + 1.1vw, 2.25rem);
          font-weight: 700;
          line-height: 1.24;
          letter-spacing: 0;
          text-align: left;
        }

        .post-content .atomic-editorial-minimalism h2::before,
        .post-content .atomic-editorial-minimalism h2::after {
          content: none;
        }

        .post-content .atomic-editorial-minimalism ol,
        .post-content .atomic-editorial-minimalism ul {
          margin: 1.5rem 0 0;
          padding: 0;
          border: 0;
          color: var(--atomic-warm-brown);
          font-family: ${bodyStack};
          list-style: none;
        }

        .post-content .atomic-editorial-minimalism li {
          margin: 0.85rem 0 0;
          padding-left: 0;
          color: var(--atomic-warm-brown);
          font-family: ${bodyStack};
          line-height: 1.7;
          text-align: left;
        }

        .post-content .atomic-editorial-minimalism li::before {
          content: none;
        }

        .post-content .atomic-editorial-minimalism strong {
          color: var(--atomic-moss);
          font-weight: 700;
        }

        .post-content .atomic-editorial-minimalism .atomic-quote-box {
          margin: 3.4rem auto;
          max-width: 35rem;
          padding: clamp(1.65rem, 4vw, 2.5rem);
          border: 1px solid rgba(58, 77, 57, 0.24);
          border-radius: 8px;
          background: var(--atomic-paper);
          color: var(--atomic-moss);
          box-shadow: 0 18px 45px rgba(109, 93, 80, 0.08);
          text-align: center;
        }

        .post-content .atomic-editorial-minimalism .atomic-quote-box span {
          display: block;
          color: var(--atomic-moss);
          font-family: ${serifStack};
          font-size: clamp(1.35rem, 1.05rem + 1vw, 1.9rem);
          font-style: italic;
          font-weight: 700;
          line-height: 1.55;
          text-wrap: balance;
        }

        .post-content .atomic-editorial-minimalism .atomic-highlight-box {
          margin: 3.5rem 0;
          padding: clamp(1.35rem, 3vw, 2rem);
          border: 1px solid rgba(58, 77, 57, 0.28);
          border-left: 4px solid var(--atomic-moss);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(58, 77, 57, 0.08), rgba(244, 239, 234, 0.92));
        }

        .post-content .atomic-editorial-minimalism .atomic-highlight-label {
          margin: 0 0 1rem;
          color: var(--atomic-moss);
          font-family: ${serifStack};
          font-size: clamp(1.18rem, 1.04rem + 0.45vw, 1.45rem);
          font-weight: 700;
          line-height: 1.35;
        }

        .post-content .atomic-editorial-minimalism .atomic-highlight-box p {
          color: var(--atomic-warm-brown);
        }

        .post-content .atomic-editorial-minimalism .atomic-highlight-box ul {
          display: grid;
          gap: 0.8rem;
          margin-top: 1.15rem;
        }

        .post-content .atomic-editorial-minimalism .atomic-highlight-box li {
          margin: 0;
          padding: 0.85rem 1rem;
          border: 1px solid rgba(58, 77, 57, 0.16);
          border-radius: 8px;
          background: rgba(253, 251, 247, 0.72);
        }

        .post-content .atomic-editorial-minimalism .atomic-steps {
          display: grid;
          gap: 0.85rem;
          margin-top: 1.5rem;
        }

        .post-content .atomic-editorial-minimalism .atomic-steps li {
          margin: 0;
          padding: 1rem 1.1rem;
          border: 1px solid rgba(58, 77, 57, 0.14);
          border-radius: 8px;
          background: rgba(244, 239, 234, 0.62);
        }

        .post-content .atomic-editorial-minimalism .atomic-final-note {
          margin-top: 3.25rem;
          padding-top: 2rem;
          border-top: 1px solid var(--atomic-line);
        }

        @media (max-width: 640px) {
          .post-content .atomic-editorial-minimalism {
            margin-inline: 0;
            padding: 1.2rem;
          }

          .post-content .atomic-editorial-minimalism .atomic-quote-box {
            margin-inline: 0;
          }
        }
      `}</style>
      {children}
    </section>
  );
}

export function EditorialQuoteBox({ children }: EditorialProps) {
  return (
    <aside className="atomic-quote-box">
      <span>{children}</span>
    </aside>
  );
}

export function EditorialHighlightBox({ title, children }: EditorialHighlightBoxProps) {
  return (
    <aside className="atomic-highlight-box">
      <p className="atomic-highlight-label">{title}</p>
      {children}
    </aside>
  );
}
