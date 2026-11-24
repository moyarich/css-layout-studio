import { zipSync, strToU8 } from "fflate";
import type { RegisteredPreset } from "./navigation";
import { sourceText, type PageSource } from "./source-types";
export function exportPresetFolder(
  activePreset: RegisteredPreset,
  htmlSource: string,
  cssSource: string,
  drafts: Record<string, string> = {},
  sources: readonly PageSource[] = activePreset.sources,
) {
  const files: Record<string, Uint8Array> = {};
  const folder = activePreset.path.split("/").slice(-2).join("/");
  for (const source of sources) {
    files[`${folder}/${source.name}`] = strToU8(
      sourceText(source, htmlSource, cssSource, drafts),
    );
  }
  const bytes = zipSync(files);
  const url = URL.createObjectURL(
    new Blob([new Uint8Array(bytes)], { type: "application/zip" }),
  );
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${activePreset.id}.zip`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
