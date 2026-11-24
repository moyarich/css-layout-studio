import { useEffect, useState } from "react";
import { PRESETS } from "../../presets";
import { useLayoutEditor } from "../editor/useLayoutEditor";
import type { EditorTheme } from "../types";
import { exportPresetFolder } from "./exportPreset";
import { layoutGroups } from "./navigation";
import { defaultSource, type PageSource } from "./source-types";

const initialPreset =
  PRESETS.find((preset) => preset.id === "article-flex") ?? PRESETS[0];
export function useStudioController() {
  const [presetId, setPresetId] = useState(initialPreset.id);
  const editor = useLayoutEditor(initialPreset);
  const [tab, setTab] = useState("");
  const [sourceFile, setSourceFile] = useState(
    defaultSource(initialPreset.sources)?.name ?? "",
  );
  const [sourceDrafts, setSourceDrafts] = useState<Record<string, string>>({});
  const [device, setDevice] = useState("fluid");
  const [notice, setNotice] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [theme, setTheme] = useState<EditorTheme>("light");
  const activePreset =
    PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
  const groups = layoutGroups;
  const activeLayout = groups
    .flatMap((group) => group.layouts)
    .find((layout) =>
      layout.variants.some((preset) => preset.id === presetId),
    )!;
  const activeCategory = groups.find((group) =>
    group.layouts.includes(activeLayout),
  );
  useEffect(() => {
    window.document.documentElement.dataset.theme = theme;
    return () => {
      delete window.document.documentElement.dataset.theme;
    };
  }, [theme]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  function loadPreset(id: string) {
    const preset = PRESETS.find((preset) => preset.id === id) ?? PRESETS[0];
    setPresetId(preset.id);
    setSourceFile(defaultSource(preset.sources)?.name ?? "");
    editor.loadPreset(preset);
    setSourceDrafts({});
    setLibraryOpen(false);
  }
  function applySource(source: PageSource, value: string) {
    if (!source.edit) return;
    if (source.language === "html") editor.applyHtmlSource(value);
    else if (source.language === "css") editor.applyCssSource(value);
    else setSourceDrafts((current) => ({ ...current, [source.name]: value }));
  }
  function showSource(file: string, targetTab: string) {
    setSourceFile(file);
    setTab(targetTab);
    window.setTimeout(() => {
      const tabRoots =
        window.document.querySelectorAll<HTMLElement>("[data-active-tab]");
      for (const root of tabRoots) {
        if (root.dataset.activeTab !== targetTab) continue;
        const editors = root.querySelectorAll<HTMLElement>(
          "[data-source-files]",
        );
        const editor = [...editors].find((node) =>
          JSON.parse(node.dataset.sourceFiles ?? "[]").includes(file),
        );
        editor?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  }
  async function copyExport() {
    try {
      await navigator.clipboard.writeText(
        `<style>\n${editor.cssSource}\n</style>\n${editor.htmlSource}`,
      );
      setNotice("Code copied to clipboard");
    } catch {
      setNotice("Clipboard unavailable. Use Export folder to save the code.");
    }
  }
  function exportFolder(sources: readonly PageSource[]) {
    exportPresetFolder(
      activePreset,
      editor.htmlSource,
      editor.cssSource,
      sourceDrafts,
      sources,
    );
    setNotice("Preset folder exported");
  }
  return {
    ...editor,
    presetId,
    activePreset,
    groups,
    activeLayout,
    activeCategory,
    tab,
    setTab,
    sourceFile,
    setSourceFile,
    sourceDrafts,
    applySource,
    device,
    setDevice,
    notice,
    setNotice,
    libraryOpen,
    setLibraryOpen,
    theme,
    setTheme,
    loadPreset,
    showSource,
    copyExport,
    exportFolder,
  };
}
