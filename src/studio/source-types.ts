/** A source imported and declared by the owning page.mdx. */
export interface PageSource {
  name: string;
  code: string;
  language?: string;
  /** Allow editing. HTML/CSS also update the live preview. */
  edit?: boolean;
  default?: boolean;
}
export function defaultSource(sources: readonly PageSource[]) {
  return sources.find((source) => source.default) ?? sources[0];
}
export function sourceText(
  source: PageSource,
  html: string,
  css: string,
  drafts: Record<string, string> = {},
) {
  if (!source.edit) return source.code;
  if (source.language === "html") return html;
  if (source.language === "css") return css;
  return drafts[source.name] ?? source.code;
}
