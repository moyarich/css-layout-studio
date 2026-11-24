import { useEffect, useState, type CSSProperties } from "react";
import type { ThemedToken, BundledLanguage } from "shiki";
import type { EditorTheme } from "../../types";

const loadShiki = () => import("shiki");
type Highlight = {
  code: string;
  language: string;
  theme: EditorTheme;
  tokens: ThemedToken[][];
};

/** React renders escaped tokens, preserving the exact source text for selection/copy. */
export function HighlightedSource({
  code,
  language,
  filename,
  theme,
  className,
}: {
  code: string;
  language: string;
  filename: string;
  theme: EditorTheme;
  className?: string;
}) {
  const [highlight, setHighlight] = useState<Highlight>();
  const grammar =
    language === "typescript" && filename.endsWith(".tsx") ? "tsx" : language;
  useEffect(() => {
    let current = true;
    void loadShiki()
      .then(
        async ({ codeToTokens, bundledLanguages, bundledLanguagesAlias }) => {
          const lang =
            grammar in bundledLanguages || grammar in bundledLanguagesAlias
              ? (grammar as BundledLanguage)
              : "text";
          const result = await codeToTokens(code, {
            lang,
            theme: theme === "dark" ? "github-dark" : "github-light",
          });
          if (current)
            setHighlight({
              code,
              language: grammar,
              theme,
              tokens: result.tokens,
            });
        },
      )
      .catch(() => {
        // Keep the source readable if a grammar/theme chunk cannot be loaded.
        if (current) setHighlight(undefined);
      });
    return () => {
      current = false;
    };
  }, [code, grammar, theme]);
  const tokens =
    highlight?.code === code &&
    highlight.language === grammar &&
    highlight.theme === theme
      ? highlight.tokens
      : undefined;
  return (
    <pre
      className={`highlighted-source ${className ?? ""}`}
      data-language={grammar}
      data-highlighted={Boolean(tokens)}
      data-code-theme={theme}
    >
      <code>
        {tokens
          ? tokens.map((line, lineIndex) => (
              <span className="line" key={lineIndex}>
                {line.map((token, index) => {
                  const style: CSSProperties = { color: token.color };
                  if (token.fontStyle && token.fontStyle > 0) {
                    if (token.fontStyle & 1) style.fontStyle = "italic";
                    if (token.fontStyle & 2) style.fontWeight = "bold";
                    if (token.fontStyle & 4) style.textDecoration = "underline";
                  }
                  return (
                    <span key={index} style={style}>
                      {token.content}
                    </span>
                  );
                })}
                {lineIndex < tokens.length - 1 ? "\n" : null}
              </span>
            ))
          : code}
      </code>
    </pre>
  );
}
