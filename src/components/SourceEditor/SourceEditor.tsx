import { lazy, Suspense } from "react";
import { ChevronRight, Copy } from "lucide-react";
import { CopyButton } from "../ui/components/CopyButton/CopyButton";
import {
  defaultSource,
  sourceText,
  type PageSource,
} from "../../studio/source-types";
import { useStudio } from "../../studio/StudioContext";
import { HighlightedSource } from "./HighlightedSource";
import "./SourceEditor.css";
const SourcePanel = lazy(async () => {
  await import("../../editor/monaco");
  const module = await import("../SourcePanel/SourcePanel");
  return { default: module.SourcePanel };
});

export function SourceEditor({
  sources,
  mode = "editor",
  targetTab,
  onOpen,
}: {
  sources: readonly PageSource[];
  targetTab?: string;
  onOpen?: (file: string) => void;
  mode?: "preview" | "editor";
}) {
  const {
    sourceFile,
    setSourceFile,
    htmlSource,
    cssSource,
    sourceDrafts,
    presetId,
    theme,
    applySource,
    sourceError,
    showSource,
    setNotice,
  } = useStudio();
  const selectedSource =
    sources.find((source) => source.name === sourceFile) ??
    defaultSource(sources);
  const selectedName = selectedSource?.name ?? "";
  const sourceValue = selectedSource
    ? sourceText(selectedSource, htmlSource, cssSource, sourceDrafts)
    : "";
  const editable = selectedSource?.edit === true;
  const language = selectedSource?.language ?? "plaintext";
  if (!selectedSource)
    return (
      <p className="empty-sources">
        This page has not declared any source files.
      </p>
    );
  return (
    <section
      className="source-peek"
      aria-label="Preset source editor"
      data-source-files={JSON.stringify(sources.map((source) => source.name))}
    >
      <div className="file-tabs" aria-label="Source files">
        {sources.map(({ name: file }) => (
          <button
            key={file}
            className={selectedName === file ? "active" : ""}
            aria-pressed={selectedName === file}
            onClick={() => setSourceFile(file)}
          >
            {file}
          </button>
        ))}
        <CopyButton
          className="file-copy"
          aria-label="Copy current file"
          value={sourceValue}
          icon={<Copy size={14} />}
          onCopy={() => setNotice("File copied")}
        >
          {null}
        </CopyButton>
      </div>
      {mode === "preview" ? (
        <>
          <HighlightedSource
            code={sourceValue.split("\n").slice(0, 8).join("\n")}
            language={language}
            filename={selectedName}
            theme={theme}
          />
          {(onOpen || targetTab) && (
            <button
              className="open-source"
              onClick={() =>
                onOpen
                  ? onOpen(selectedName)
                  : targetTab && showSource(selectedName, targetTab)
              }
            >
              Open source editor <ChevronRight size={14} />
            </button>
          )}
        </>
      ) : editable ? (
        <div className="editor-frame">
          <Suspense
            fallback={
              <div className="editor-loading">Loading source editor…</div>
            }
          >
            <SourcePanel
              key={`${presetId}-${selectedName}`}
              formatOnLoad={false}
              label={selectedName}
              language={language}
              value={sourceValue}
              theme={theme}
              onApply={(value) => applySource(selectedSource, value)}
              error={
                sourceError?.panel === language
                  ? sourceError.message
                  : undefined
              }
            />
          </Suspense>
        </div>
      ) : (
        <HighlightedSource
          code={sourceValue}
          language={language}
          filename={selectedName}
          theme={theme}
          className="read-only-source"
        />
      )}
      {mode === "editor" && (
        <div className="source-status">
          {editable
            ? language === "html" || language === "css"
              ? "Changes apply to the live preview · Export to save your work"
              : "Changes are kept in this session · Export to save your work"
            : "Reference source · Included in folder export"}
        </div>
      )}
    </section>
  );
}
