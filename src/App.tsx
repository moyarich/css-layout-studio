import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ComponentProps, CSSProperties } from "react";
import { zipSync, strToU8 } from "fflate";
import { DocumentationPreviewContext } from "./components/Preview/DocumentationPreview";
import type { Rule } from "css-tree";
import {
  Boxes,
  Copy,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Layers,
  LayoutGrid,
  FileCode2,
  FileText,
  Moon,
  Sun,
  Check,
  Play,
  Monitor,
  Tablet,
  Smartphone,
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Inspector } from "./components/Inspector/Inspector";
import { MarkupTree } from "./components/MarkupTree/MarkupTree";
import { type SelectedPreviewElement } from "./components/Preview/Preview";
import { CanvasArea } from "./components/Preview/CanvasArea";
const SourcePanel = lazy(async () => {
  await import("./editor/monaco");
  const module = await import("./components/SourcePanel/SourcePanel");
  return { default: module.SourcePanel };
});

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

const INITIAL_PRESET =
  PRESETS.find((preset) => preset.id === "article-flex") ?? PRESETS[0];
const sourceFiles = [
  "index.html",
  "styles.css",
  "layout.tsx",
  "preview.tsx",
  "page.mdx",
  "preset.json",
] as const;
type SourceFile = (typeof sourceFiles)[number];
type WorkspaceTab = "Overview" | "Playground" | "Source";

function layoutName(name: string) {
  return name.replace(/\s*-\s*(Flex|Grid)$/i, "");
}

export default function App() {
  const [presetId, setPresetId] = useState(INITIAL_PRESET.id);
  const [document, setDocument] = useState<EditorDocument>(() =>
    createEditorDocument(INITIAL_PRESET),
  );
  // Keep the authored/formatted editor buffer separate from the executable
  // AST. Regenerating this string from css-tree on every render minifies it and
  // can overwrite Monaco while the user is typing.
  const [cssSource, setCssSource] = useState(INITIAL_PRESET.css.trim());
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [previewSelection, setPreviewSelection] =
    useState<SelectedPreviewElement | null>(null);
  const [computed, setComputed] = useState<ComputedSnapshot>({});
  const [sourceError, setSourceError] = useState<SourceError>(null);
  const [tab, setTab] = useState<WorkspaceTab>("Overview");
  const [sourceFile, setSourceFile] = useState<SourceFile>("styles.css");
  const [railTab, setRailTab] = useState<"Inspector" | "Outline">("Inspector");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () =>
      new Set(
        PRESETS.filter(
          (preset) =>
            `${preset.source}/${preset.path.split("/")[0]}` !==
            `${INITIAL_PRESET.source}/${INITIAL_PRESET.path.split("/")[0]}`,
        ).map((preset) => `${preset.source}/${preset.path.split("/")[0]}`),
      ),
  );
  const [device, setDevice] = useState("fluid");
  const [notice, setNotice] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [theme, setTheme] = useState<EditorTheme>("light");

  useEffect(() => {
    window.document.documentElement.dataset.theme = theme;
    return () => {
      delete window.document.documentElement.dataset.theme;
    };
  }, [theme]);

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
    setSelectedElement(null);
    setPreviewSelection(null);
    setComputed({});
    setLibraryOpen(false);
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

  const groups = useMemo(() => {
    const categories = new Map<
      string,
      { label: string; layouts: Map<string, typeof PRESETS> }
    >();
    for (const preset of PRESETS) {
      const parts = preset.path.split("/");
      const categoryKey = `${preset.source}/${parts[0]}`;
      const layoutKey = `${categoryKey}/${parts.slice(1, -1).join("/")}`;
      if (!categories.has(categoryKey))
        categories.set(categoryKey, {
          label: preset.editor?.category ?? parts[0],
          layouts: new Map(),
        });
      const layouts = categories.get(categoryKey)!.layouts;
      if (!layouts.has(layoutKey)) layouts.set(layoutKey, []);
      layouts.get(layoutKey)!.push(preset);
    }
    return [...categories].map(([key, category]) => ({
      key,
      label: category.label,
      layouts: [...category.layouts].map(([key, variants]) => ({
        key,
        variants,
        name: layoutName(variants[0].name),
      })),
    }));
  }, []);
  const activeLayout = groups
    .flatMap((group) => group.layouts)
    .find((layout) =>
      layout.variants.some((preset) => preset.id === presetId),
    )!;
  const activeCategory = groups.find((group) =>
    group.layouts.includes(activeLayout),
  );
  const Page = activePreset.Page;
  const sourceValue =
    sourceFile === "index.html"
      ? htmlSource
      : sourceFile === "styles.css"
        ? cssSource
        : (activePreset.sources[sourceFile] ?? "");

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(
        `<style>\n${cssSource}\n</style>\n${htmlSource}`,
      );
      setNotice("Code copied to clipboard");
    } catch {
      setNotice("Clipboard unavailable. Use Export folder to save the code.");
    }
  };
  const exportFolder = () => {
    const files: Record<string, Uint8Array> = {};
    const folder = activePreset.path.split("/").slice(-2).join("/");
    for (const name of sourceFiles) {
      // Keep the exported preview independent of the editor's documentation context.
      let value =
        name === "index.html"
          ? htmlSource
          : name === "styles.css"
            ? cssSource
            : (activePreset.sources[name] ?? "");
      if (name === "preview.tsx")
        value = value
          .replace(/^import .*useContext.*\n/gm, "")
          .replace(/^import .*DocumentationPreviewContext.*\n/gm, "")
          .replace(
            /^\s*const livePreview = useContext.*\n\s*if \(livePreview\)\s*return livePreview;\n/gm,
            "",
          );
      files[`${folder}/${name}`] = strToU8(value);
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
    setNotice("Preset folder exported");
  };
  const showSource = (file: SourceFile) => {
    setSourceFile(file);
    setTab("Source");
  };
  const mdxComponents = {
    h1: () => null,
    a: ({ href, children, ...props }: ComponentProps<"a">) => {
      const file = href?.replace(/^.\//, "") as SourceFile;
      if (sourceFiles.includes(file))
        return (
          <button className="doc-source-link" onClick={() => showSource(file)}>
            {children}
            <FileCode2 size={13} />
          </button>
        );
      return (
        <a {...props} href={href} target="_blank" rel="noopener noreferrer">
          {children}
          <ArrowUpRight size={13} />
        </a>
      );
    },
  };
  const livePreview = (
    <section className="live-card" aria-label="Interactive layout preview">
      <div className="live-toolbar">
        <strong>
          <Play size={16} /> Live preview
        </strong>
        <div className="preview-controls">
          <div className="segmented" aria-label="Layout implementation">
            {activeLayout.variants.map((variant) => (
              <button
                key={variant.id}
                aria-pressed={variant.id === presetId}
                onClick={() => loadPreset(variant.id)}
              >
                {variant.type === "flex"
                  ? "Flexbox"
                  : variant.type === "grid"
                    ? "Grid"
                    : variant.name}
              </button>
            ))}
          </div>
          <div className="segmented devices" aria-label="Preview viewport">
            {[
              { id: "fluid", label: "Desktop", Icon: Monitor },
              { id: "768", label: "Tablet", Icon: Tablet },
              { id: "375", label: "Phone", Icon: Smartphone },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                title={label}
                aria-label={label}
                aria-pressed={device === id}
                onClick={() => setDevice(id)}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <span className="viewport-label">
            {device === "fluid" ? "Responsive" : `${device} px`}
          </span>
        </div>
      </div>
      <div
        className="live-viewport"
        data-device={device}
        style={
          {
            "--viewport-width": device === "fluid" ? "100%" : `${device}px`,
          } as CSSProperties
        }
      >
        <CanvasArea
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
      </div>
      <div className="live-footer">
        <span>
          <span className="status-dot" /> Click a region to inspect its styles
        </span>
        <code>
          {selectedHastElement
            ? preferredSelector(selectedHastElement)
            : ".container"}
        </code>
      </div>
    </section>
  );
  const sourceTabs = (
    <div className="file-tabs" aria-label="Source files">
      {sourceFiles.map((file) => (
        <button
          key={file}
          className={sourceFile === file ? "active" : ""}
          onClick={() => setSourceFile(file)}
        >
          {file}
        </button>
      ))}
      <button
        className="file-copy"
        aria-label="Copy current file"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(sourceValue);
            setNotice("File copied");
          } catch {
            setNotice("Clipboard unavailable");
          }
        }}
      >
        <Copy size={14} />
      </button>
    </div>
  );

  return (
    <div className="app-shell studio" data-theme={theme}>
      <header className="studio-header">
        <a
          className="studio-brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setTab("Overview");
          }}
        >
          <Boxes size={26} />
          <strong>Layout Studio</strong>
        </a>
        <div className="studio-breadcrumb">
          <Layers size={16} />
          <ChevronRight size={14} />
          <span>{activeCategory?.label}</span>
          <span>/</span>
          <strong>{activeLayout.name}</strong>
        </div>
        <div className="studio-actions">
          <button
            className="icon-button mobile-library-toggle"
            aria-label="Toggle layout library"
            onClick={() => setLibraryOpen(!libraryOpen)}
          >
            {libraryOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>
          <button
            className="icon-button"
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="studio-button copy-button" onClick={copyExport}>
            <Copy size={15} />
            Copy code
          </button>
          <button className="studio-button primary" onClick={exportFolder}>
            <Download size={15} />
            Export folder
          </button>
        </div>
      </header>
      <div className="studio-workspace">
        <aside
          className={`library ${libraryOpen ? "is-open" : ""}`}
          aria-label="Layout library"
        >
          <div className="library-search">
            <Search size={16} />
            <input
              aria-label="Search layouts"
              placeholder="Search layouts…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>⌕</kbd>
          </div>
          <p className="eyebrow">Layout library</p>
          <nav className="library-nav">
            {groups.map((group) => {
              const layouts = group.layouts.filter((layout) =>
                `${group.label} ${layout.name}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              );
              if (!layouts.length) return null;
              const open = query.length > 0 || !collapsed.has(group.key);
              return (
                <section key={group.key} className="library-group">
                  <button
                    className="category-button"
                    aria-expanded={open}
                    onClick={() =>
                      setCollapsed((current) => {
                        const next = new Set(current);
                        next.has(group.key)
                          ? next.delete(group.key)
                          : next.add(group.key);
                        return next;
                      })
                    }
                  >
                    <BookOpen size={17} />
                    <span>{group.label}</span>
                    <span className="category-count">
                      {group.layouts.length}
                    </span>
                    {open ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                  {open && (
                    <div className="library-items">
                      {layouts.map((layout) => (
                        <button
                          key={layout.key}
                          className={
                            layout.key === activeLayout.key ? "selected" : ""
                          }
                          aria-current={
                            layout.key === activeLayout.key ? "page" : undefined
                          }
                          onClick={() =>
                            loadPreset(
                              (
                                layout.variants.find(
                                  (variant) =>
                                    variant.type === activePreset.type,
                                ) ?? layout.variants[0]
                              ).id,
                            )
                          }
                        >
                          <LayoutGrid size={15} />
                          <span>{layout.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
            {!groups.some((group) =>
              group.layouts.some((layout) =>
                `${group.label} ${layout.name}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              ),
            ) && (
              <p className="empty-search">
                No layouts found. Try another name.
              </p>
            )}
          </nav>
          <footer className="library-footer">
            <span>
              {PRESETS.length} presets ·{" "}
              {groups.reduce((sum, group) => sum + group.layouts.length, 0)}{" "}
              layouts
            </span>
            <Layers size={15} />
          </footer>
        </aside>
        <main className={`studio-main tab-${tab.toLowerCase()}`}>
          <div className="page-heading">
            <span className="page-badge">
              <FileText size={12} />
              page.mdx
            </span>
            <h1>{activeLayout.name}</h1>
            <p>{activePreset.description}</p>
          </div>
          <div className="workspace-tabs" role="tablist" aria-label="Workspace">
            {(["Overview", "Playground", "Source"] as const).map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={tab === item}
                aria-controls="workspace-panel"
                id={`tab-${item}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
            <span className="workspace-path" title={activePreset.path}>
              {activePreset.type === "flex" ? "Flexbox" : "CSS Grid"}
            </span>
          </div>
          <div
            id="workspace-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "Overview" && (
              <>
                <DocumentationPreviewContext.Provider value={livePreview}>
                  <article className="mdx-page">
                    <Page components={mdxComponents} />
                  </article>
                </DocumentationPreviewContext.Provider>
                <section className="source-peek">
                  {sourceTabs}
                  <pre>
                    <code>
                      {sourceValue.split("\n").slice(0, 8).join("\n")}
                    </code>
                  </pre>
                  <button
                    className="open-source"
                    onClick={() => setTab("Source")}
                  >
                    Open source editor <ChevronRight size={14} />
                  </button>
                </section>
              </>
            )}
            {tab === "Playground" && (
              <>
                {livePreview}
                <div className="playground-note">
                  <Layers size={18} />
                  <div>
                    <strong>Make it your own</strong>
                    <p>
                      Select any region to adjust its layout in the inspector.
                      HTML and CSS edits update the preview immediately.
                    </p>
                  </div>
                </div>
                <section className="source-peek">
                  {sourceTabs}
                  {sourceFile === "index.html" ||
                  sourceFile === "styles.css" ? (
                    <div className="editor-frame">
                      <Suspense
                        fallback={
                          <div className="editor-loading">
                            Loading source editor…
                          </div>
                        }
                      >
                        <SourcePanel
                          formatOnLoad={false}
                          key={`${presetId}-${sourceFile}`}
                          label={sourceFile}
                          language={
                            sourceFile === "index.html" ? "html" : "css"
                          }
                          theme={theme}
                          value={sourceValue}
                          onApply={
                            sourceFile === "index.html"
                              ? applyHtmlSource
                              : applyCssSource
                          }
                          error={
                            sourceError?.panel ===
                            (sourceFile === "index.html" ? "html" : "css")
                              ? sourceError.message
                              : undefined
                          }
                        />
                      </Suspense>
                    </div>
                  ) : (
                    <pre>
                      <code>{sourceValue}</code>
                    </pre>
                  )}
                </section>
              </>
            )}
            {tab === "Source" && (
              <section className="source-workspace">
                {sourceTabs}
                {sourceFile === "index.html" || sourceFile === "styles.css" ? (
                  <div className="editor-frame">
                    <Suspense
                      fallback={
                        <div className="editor-loading">
                          Loading source editor…
                        </div>
                      }
                    >
                      <SourcePanel
                        formatOnLoad={false}
                        key={`${presetId}-${sourceFile}`}
                        label={sourceFile}
                        language={sourceFile === "index.html" ? "html" : "css"}
                        theme={theme}
                        value={sourceValue}
                        onApply={
                          sourceFile === "index.html"
                            ? applyHtmlSource
                            : applyCssSource
                        }
                        error={
                          sourceError?.panel ===
                          (sourceFile === "index.html" ? "html" : "css")
                            ? sourceError.message
                            : undefined
                        }
                      />
                    </Suspense>
                  </div>
                ) : (
                  <pre className="read-only-source">
                    <code>{sourceValue}</code>
                  </pre>
                )}
                <div className="source-status">
                  {sourceFile === "index.html" || sourceFile === "styles.css"
                    ? "Changes apply to the live preview · Export to save your work"
                    : "Reference source · Included in folder export"}
                </div>
              </section>
            )}
          </div>
        </main>
        <aside className="studio-inspector" aria-label="Layout inspector">
          <div className="inspector-tabs">
            {(["Inspector", "Outline"] as const).map((item) => (
              <button
                key={item}
                aria-pressed={railTab === item}
                onClick={() => setRailTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="inspector-content">
            {railTab === "Inspector" ? (
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
            ) : (
              <>
                <div className="outline-heading">
                  <Layers size={16} />
                  Document outline
                </div>
                <MarkupTree
                  root={document.htmlAst}
                  selectedId={document.selectedNodeId}
                  onSelect={selectNode}
                />
              </>
            )}
          </div>
          <button className="about-layout" onClick={() => setTab("Overview")}>
            <span className="about-icon">
              <FileText size={21} />
            </span>
            <span>
              <strong>About this layout</strong>
              <small>Preview, guidance and examples from page.mdx</small>
            </span>
            <ChevronRight size={15} />
          </button>
        </aside>
      </div>
      {notice && (
        <div className="studio-toast" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}
