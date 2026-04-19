import { createHighlighter, type Highlighter } from "shiki";

let highlighterSingleton: Highlighter | null = null;

const THEME = "github-dark";
const LANGUAGES = ["typescript", "javascript", "bash", "mdx", "css", "json", "rust", "go", "tsx", "html"];

export async function highlightCode(code: string, lang: string) {
  if (!highlighterSingleton) {
    highlighterSingleton = await createHighlighter({
      themes: [THEME],
      langs: LANGUAGES,
    });
  }

  try {
    return highlighterSingleton.codeToHtml(code, {
      lang: LANGUAGES.includes(lang) ? lang : "text",
      theme: THEME,
    });
  } catch (error) {
    console.error("Shiki highlighting error:", error);
    return `<code>${code}</code>`;
  }
}
