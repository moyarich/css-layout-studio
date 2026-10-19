import { useEffect, useId, useMemo, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Copy, FileText, Redo2, RotateCcw, Save, Undo2 } from "lucide-react";
import {
  buildLanguageOptionsFromIds,
  MonacoEditorHandle,
} from "./MonacoEditor";

type EditorLikeRef = RefObject<MonacoEditorHandle | null>;

export type EditorMenuProps = {
  editorRef: EditorLikeRef;
  language: string;
  languages?: string[];
  title?: string;
  onSave?: (value: string) => void;
  onReset?: () => void;
  className?: string;
};

export function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950 focus-visible:bg-zinc-200 focus-visible:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 active:bg-zinc-300"
    >
      {children}
    </button>
  );
}

export function ToolbarGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 last:border-r-0 last:pr-0">
      {children}
    </div>
  );
}

export function EditorMenu({
  editorRef,
  language,
  languages,
  title = "Editor menu",
  onSave,
  onReset,
  className,
}: EditorMenuProps) {
  const languageSelectId = useId();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languageOptions = useMemo(() => {
    if (languages?.length) {
      return buildLanguageOptionsFromIds(languages);
    }

    return [language];
  }, [languages]);

  useEffect(() => {
    const currentLanguage =
      editorRef.current?.getEditor()?.getModel()?.getLanguageId() ?? language;
    setSelectedLanguage(currentLanguage);
  }, [editorRef, language, languageOptions]);

  const changeLanguage = (nextLanguage: string) => {
    const editor = editorRef.current?.getEditor();
    const monaco = editorRef.current?.getMonaco();
    const model = editor?.getModel();

    if (!monaco || !model) return;

    monaco.editor.setModelLanguage(model, nextLanguage);
    setSelectedLanguage(nextLanguage);
  };

  return (
    <nav
      aria-label={title}
      className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200  px-2 py-1 shadow-inner {className}"
    >
      <ToolbarGroup>
        <label className="sr-only" htmlFor={languageSelectId}>
          Editor language
        </label>
        <select
          id={languageSelectId}
          value={selectedLanguage}
          onChange={(event) => changeLanguage(event.target.value)}
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-800 outline-none hover:border-zinc-400 hover:bg-zinc-50 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          title="Editor language"
        >
          {!languageOptions.includes(selectedLanguage) ? (
            <option value={selectedLanguage}>{selectedLanguage}</option>
          ) : null}

          {languageOptions.map((langId) => (
            <option key={langId} value={langId}>
              {langId}
            </option>
          ))}
        </select>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton title="Undo" onClick={() => editorRef.current?.undo()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="Redo" onClick={() => editorRef.current?.redo()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          title="Format document"
          onClick={() => void editorRef.current?.format()}
        >
          <FileText className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          title="Copy value"
          onClick={() => void editorRef.current?.copy()}
        >
          <Copy className="h-4 w-4" />
        </ToolbarButton>

        {onSave ? (
          <ToolbarButton
            title="Save value"
            onClick={() =>
              onSave(editorRef.current?.getEditor()?.getValue() ?? "")
            }
          >
            <Save className="h-4 w-4" />
          </ToolbarButton>
        ) : null}
      </ToolbarGroup>

      {onReset ? (
        <ToolbarGroup>
          <ToolbarButton title="Reset value" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </ToolbarButton>
        </ToolbarGroup>
      ) : null}
    </nav>
  );
}
