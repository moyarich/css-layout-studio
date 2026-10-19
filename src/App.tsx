import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Rule } from "css-tree";
import {
  Braces,
  Code2,
  Copy,
  ExternalLink,
  Globe2,
  Moon,
  PanelLeft,
  Sparkles,
  Sun,
} from "lucide-react";
import { Inspector } from "./components/Inspector/Inspector";
import { MarkupTree } from "./components/MarkupTree/MarkupTree";
import { type SelectedPreviewElement } from "./components/Preview/Preview";
import { CanvasArea } from "./components/Preview/CanvasArea";
import { SourcePanel } from "./components/SourcePanel/SourcePanel";
import { ResizeHandle } from "./components/ResizeHandle/ResizeHandle";
import "./App.css";
import {
  appendRuleWithDeclaration,
  formatCss,
  generateCss,
  getMatchingRules,
  parseCssSource,
  removeDeclaration,
  setDeclaration,
} from "./editor/css";
import { createEditorDocument } from "./editor/document";
import {
  findElementByEditorId,
  firstElementId,
  parseHtmlSource,
  preferredSelector,
  serializeHtml,
  serializePreviewHtml,
} from "./editor/html";
import type {
  ComputedSnapshot,
  EditorDocument,
  SourceError,
} from "./editor/types";
import { PRESETS } from "../presets";
import { EditorTheme, EditorNodeId } from "./types";

const COMPUTED_PROPERTIES = [
  "display",
  "position",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "order",
  "justify-content",
  "align-items",
  "align-content",
  "align-self",
  "grid-template-columns",
  "grid-template-rows",
  "grid-auto-flow",
  "grid-auto-columns",
  "grid-auto-rows",
  "grid-column",
  "grid-row",
  "grid-area",
  "justify-items",
  "justify-self",
  "gap",
  "width",
  "height",
  "min-width",
  "padding",
  "margin",
  "min-height",
  "max-width",
  "max-height",
  "overflow",
  "background",
  "border",
  "border-radius",
  "box-shadow",
  "clip-path",
  "opacity",
  "color",
  "font-size",
  "font-weight",
  "line-height",
  "text-align",
];

const DEFAULT_PANE_SIZES = { left: 240, right: 320, source: 310 };
const PANE_SIZE_STORAGE_KEY = "ast-layout-editor:pane-sizes";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function maximumSourceHeight() {
  return Math.max(180, Math.min(620, window.innerHeight - 284));
}

function initialPaneSizes() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(PANE_SIZE_STORAGE_KEY) ?? "null",
    );
    return {
      left: clamp(Number(stored?.left) || DEFAULT_PANE_SIZES.left, 170, 460),
      right: clamp(Number(stored?.right) || DEFAULT_PANE_SIZES.right, 260, 560),
      source: clamp(
        Number(stored?.source) || DEFAULT_PANE_SIZES.source,
        180,
        maximumSourceHeight(),
      ),
    };
  } catch {
    return DEFAULT_PANE_SIZES;
  }
}

export default function App() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [document, setDocument] = useState<EditorDocument>(() =>
    createEditorDocument(PRESETS[0]),
  );
  // Keep the authored/formatted editor buffer separate from the executable
  // AST. Regenerating this string from css-tree on every render minifies it and
  // can overwrite Monaco while the user is typing.
  const [cssSource, setCssSource] = useState(PRESETS[0].css.trim());
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [previewSelection, setPreviewSelection] =
    useState<SelectedPreviewElement | null>(null);
  const [computed, setComputed] = useState<ComputedSnapshot>({});
  const [sourceError, setSourceError] = useState<SourceError>(null);
  const [sourceOpen, setSourceOpen] = useState(true);
  const [paneSizes, setPaneSizes] = useState(initialPaneSizes);
  const [theme, setTheme] = useState<EditorTheme>(() =>
    window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  );

  useEffect(() => {
    window.document.documentElement.dataset.theme = theme;
    return () => {
      delete window.document.documentElement.dataset.theme;
    };
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(PANE_SIZE_STORAGE_KEY, JSON.stringify(paneSizes));
  }, [paneSizes]);

  useEffect(() => {
    const fitPanesToViewport = () =>
      setPaneSizes((current) => ({
        ...current,
        source: clamp(current.source, 180, maximumSourceHeight()),
      }));
    window.addEventListener("resize", fitPanesToViewport);
    return () => window.removeEventListener("resize", fitPanesToViewport);
  }, []);

  const htmlSource = useMemo(
    () => serializeHtml(document.htmlAst),
    [document.htmlAst, document.revision],
  );
  const previewHtml = useMemo(
    () => serializePreviewHtml(document.htmlAst),
    [document.htmlAst, document.revision],
  );
  const previewCss = useMemo(
    () => generateCss(document.cssAst),
    [document.cssAst, document.revision],
  );
  const activePreset = useMemo(
    () => PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0],
    [presetId],
  );

  const selectedHastElement = useMemo(
    () => findElementByEditorId(document.htmlAst, document.selectedNodeId),
    [document.htmlAst, document.selectedNodeId, document.revision],
  );

  const preferredRule = useMemo<Rule | null>(() => {
    if (!selectedElement) return null;
    const matches = getMatchingRules(document.cssAst, selectedElement);
    return matches.at(-1)?.rule ?? null;
  }, [document.cssAst, document.revision, selectedElement]);

  const refreshComputed = useCallback(
    (selection: SelectedPreviewElement | null) => {
      const element = selection?.element ?? null;
      setPreviewSelection(selection);
      setSelectedElement(element);
      if (!element) {
        setComputed({});
        return;
      }
      const style = getComputedStyle(element);
      setComputed(
        Object.fromEntries(
          COMPUTED_PROPERTIES.map((property) => [
            property,
            style.getPropertyValue(property),
          ]),
        ),
      );
    },
    [],
  );

  const bump = useCallback(() => {
    setDocument((current) => ({ ...current, revision: current.revision + 1 }));
  }, []);

  const selectNode = useCallback((id: EditorNodeId) => {
    setDocument((current) => ({ ...current, selectedNodeId: id }));
  }, []);

  const editDeclaration = useCallback(
    (rule: Rule | null, property: string, value: string) => {
      if (!value.trim()) return;

      let targetRule = rule;
      if (!targetRule) {
        const hastElement = findElementByEditorId(
          document.htmlAst,
          document.selectedNodeId,
        );
        if (!hastElement) return;
        targetRule = appendRuleWithDeclaration(
          document.cssAst,
          preferredSelector(hastElement),
          property,
          value,
        );
      } else {
        setDeclaration(targetRule, property, value);
      }
      setSourceError(null);
      setCssSource(formatCss(document.cssAst));
      bump();
    },
    [bump, document.cssAst, document.htmlAst, document.selectedNodeId],
  );

  const resetDeclaration = useCallback(
    (rule: Rule | null, property: string) => {
      if (!rule) return;
      removeDeclaration(rule, property);
      setSourceError(null);
      setCssSource(formatCss(document.cssAst));
      bump();
    },
    [bump],
  );

  const loadPreset = (nextId: string) => {
    const preset = PRESETS.find((item) => item.id === nextId) ?? PRESETS[0];
    setPresetId(preset.id);
    setDocument(createEditorDocument(preset));
    setCssSource(preset.css.trim());
    setSourceError(null);
  };

  const applyHtmlSource = (source: string) => {
    try {
      const htmlAst = parseHtmlSource(source);
      setDocument((current) => ({
        ...current,
        htmlAst,
        selectedNodeId: firstElementId(htmlAst),
        revision: current.revision + 1,
      }));
      setSourceError(null);
    } catch (error) {
      setSourceError({
        panel: "html",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const applyCssSource = (source: string) => {
    try {
      const cssAst = parseCssSource(source);
      setDocument((current) => ({
        ...current,
        cssAst,
        revision: current.revision + 1,
      }));
      setCssSource(source);
      setSourceError(null);
    } catch (error) {
      setSourceError({
        panel: "css",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const copyExport = async () => {
    await navigator.clipboard.writeText(
      `<style>\n${cssSource}\n</style>\n${htmlSource}`,
    );
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="app-shell__header">
        <div className="app-shell__brand-lockup">
          <div className="app-shell__brand-icon">
            <Sparkles size={17} />
          </div>
          <div>
            <strong>AST Layout Editor</strong>
            <span>HAST + CSS Tree</span>
          </div>
        </div>
        <div className="app-shell__header-actions">
          <button
            className={`app-shell__toolbar-button app-shell__theme-toggle`}
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            title={`Use ${theme === "dark" ? "light" : "dark"} theme`}
            aria-label={`Use ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <select
            className="app-shell__preset-select"
            value={presetId}
            onChange={(event) => loadPreset(event.target.value)}
          >
            {PRESETS.map((preset) => (
              <option value={preset.id} key={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <button
            className="app-shell__toolbar-button"
            onClick={() => setSourceOpen((open) => !open)}
          >
            <Code2 size={15} /> Source
          </button>
          <button
            className={`app-shell__toolbar-button is-primary`}
            onClick={copyExport}
          >
            <Copy size={15} /> Copy export
          </button>
        </div>
      </header>

      <main
        className={`app-shell__editor-grid ${sourceOpen ? "has-source" : ""}`}
        style={
          {
            "--left-pane-width": `${paneSizes.left}px`,
            "--right-pane-width": `${paneSizes.right}px`,
            "--source-pane-height": `${paneSizes.source}px`,
          } as CSSProperties
        }
      >
        {"<!-- Sidebar-- ->"}
        <aside className="app-shell__left-rail">
          <div className="app-shell__panel-heading">
            <div>
              <span className="app-shell__panel-kicker">Document</span>
              <strong>Markup tree</strong>
            </div>
            <PanelLeft size={15} />
          </div>
          <MarkupTree
            root={document.htmlAst}
            selectedId={document.selectedNodeId}
            onSelect={selectNode}
          />
          <div className="app-shell__architecture-note">
            <Braces size={15} />
            <p>
              <strong>No parallel layout model.</strong> The tree above is the
              HAST document itself.
            </p>
          </div>
          <section
            className="app-shell__in-the-wild"
            aria-labelledby="in-the-wild-title"
          >
            <div className="app-shell__in-the-wild-heading">
              <Globe2 size={14} aria-hidden="true" />
              <strong id="in-the-wild-title">In the wild</strong>
            </div>
            <ul>
              {(activePreset.inTheWild ?? []).map((example) => (
                <li key={`${example.name}-${example.url ?? "unlinked"}`}>
                  {example.url ? (
                    <a
                      href={example.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{example.name}</span>
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  ) : (
                    <span>{example.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <ResizeHandle
          className="app-shell__left-resize-handle"
          orientation="vertical"
          label="Resize document tree"
          onResize={(delta) =>
            setPaneSizes((current) => ({
              ...current,
              left: clamp(current.left + delta, 170, 460),
            }))
          }
          onReset={() =>
            setPaneSizes((current) => ({
              ...current,
              left: DEFAULT_PANE_SIZES.left,
            }))
          }
        />

        <CanvasArea
          className="app-shell__canvas-pane"
          html={previewHtml}
          css={previewCss}
          selectedId={document.selectedNodeId}
          selectedLabel={
            selectedHastElement ? preferredSelector(selectedHastElement) : null
          }
          selection={previewSelection}
          theme={theme}
          onSelect={selectNode}
          onSelectedElement={refreshComputed}
        />

        <ResizeHandle
          className="app-shell__right-resize-handle"
          orientation="vertical"
          label="Resize inspector"
          onResize={(delta) =>
            setPaneSizes((current) => ({
              ...current,
              right: clamp(current.right - delta, 260, 560),
            }))
          }
          onReset={() =>
            setPaneSizes((current) => ({
              ...current,
              right: DEFAULT_PANE_SIZES.right,
            }))
          }
        />

        <aside className="app-shell__right-rail">
          <Inspector
            cssAst={document.cssAst}
            revision={document.revision}
            selectedElement={selectedElement}
            computed={computed}
            preferredRule={preferredRule}
            layout={previewSelection?.layout ?? null}
            onChange={editDeclaration}
            onReset={resetDeclaration}
          />
        </aside>

        {sourceOpen ? (
          <>
            <ResizeHandle
              className="app-shell__source-resize-handle"
              orientation="horizontal"
              label="Resize source editors"
              onResize={(delta) =>
                setPaneSizes((current) => ({
                  ...current,
                  source: clamp(
                    current.source - delta,
                    180,
                    maximumSourceHeight(),
                  ),
                }))
              }
              onReset={() =>
                setPaneSizes((current) => ({
                  ...current,
                  source: DEFAULT_PANE_SIZES.source,
                }))
              }
            />
            <section className="app-shell__source-dock">
              <SourcePanel
                label="HTML"
                language="html"
                theme={theme}
                value={htmlSource}
                onApply={applyHtmlSource}
                error={
                  sourceError?.panel === "html"
                    ? sourceError.message
                    : undefined
                }
              />
              <SourcePanel
                label="CSS"
                language="css"
                theme={theme}
                value={cssSource}
                onApply={applyCssSource}
                error={
                  sourceError?.panel === "css" ? sourceError.message : undefined
                }
              />
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
