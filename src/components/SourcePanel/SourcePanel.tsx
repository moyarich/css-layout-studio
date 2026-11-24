import { useEffect, useRef, useState } from "react";
import { type OnMount } from "@monaco-editor/react";
import {
  MonacoEditor,
  type MonacoEditorHandle,
} from "../MonacoEditor/MonacoEditor";
import { EditorMenu } from "../MonacoEditor/EditorMenu";
import type { EditorTheme } from "../../editor/types";
import "./SourcePanel.css";

type SourceLanguage = string;

type SourcePanelProps = {
  label: string;
  language: SourceLanguage;
  value: string;
  onApply: (value: string) => void;
  error?: string;
  theme: EditorTheme;
  autoSave?: boolean;
  showToolbar?: boolean;
  formatOnLoad?: boolean;
};

export function SourcePanel({
  label,
  language,
  value,
  onApply,
  error,
  theme,
  autoSave = true,
  showToolbar = true,
  formatOnLoad = true,
}: SourcePanelProps) {
  const [draft, setDraft] = useState(value);
  const [savedDraft, setSavedDraft] = useState(value);
  const draftRef = useRef(value);
  const savedDraftRef = useRef(value);
  const editorRef = useRef<MonacoEditorHandle>(null);
  const pendingAutoSaveRef = useRef<string | null>(null);
  const pendingClearTimerRef = useRef<number | null>(null);
  const externalFormatTimerRef = useRef<number | null>(null);
  const hasSeenInitialValueRef = useRef(false);

  const dirty = draft !== savedDraft;

  useEffect(() => {
    const isInitialValue = !hasSeenInitialValueRef.current;
    hasSeenInitialValueRef.current = true;

    if (pendingAutoSaveRef.current !== null) {
      pendingAutoSaveRef.current = null;
      if (pendingClearTimerRef.current !== null) {
        window.clearTimeout(pendingClearTimerRef.current);
        pendingClearTimerRef.current = null;
      }
      return;
    }

    // Monaco owns intermediate text. A controlled value arriving while the
    // draft is dirty must not replace what the user is still typing.
    if (draftRef.current !== savedDraftRef.current) return;

    editorRef.current?.cancelPendingSave();
    draftRef.current = value;
    savedDraftRef.current = value;
    setDraft(value);
    setSavedDraft(value);

    if (!isInitialValue && formatOnLoad) {
      if (externalFormatTimerRef.current !== null) {
        window.clearTimeout(externalFormatTimerRef.current);
      }
      // Wait until React has passed the external value into Monaco's model.
      externalFormatTimerRef.current = window.setTimeout(() => {
        void editorRef.current?.format();
        externalFormatTimerRef.current = null;
      }, 0);
    }
  }, [formatOnLoad, value]);

  useEffect(
    () => () => {
      if (pendingClearTimerRef.current !== null) {
        window.clearTimeout(pendingClearTimerRef.current);
      }
      if (externalFormatTimerRef.current !== null) {
        window.clearTimeout(externalFormatTimerRef.current);
      }
    },
    [],
  );

  const handleMount: OnMount = (editor) => {
    editor.focus();
  };

  const handleReset = () => {
    pendingAutoSaveRef.current = null;
    editorRef.current?.cancelPendingSave();
    draftRef.current = value;
    savedDraftRef.current = value;
    setDraft(value);
    setSavedDraft(value);
  };

  const saveDraft = (nextValue: string, background: boolean) => {
    if (nextValue === savedDraftRef.current) return;
    savedDraftRef.current = nextValue;
    setSavedDraft(nextValue);
    if (background) {
      pendingAutoSaveRef.current = nextValue;
      if (pendingClearTimerRef.current !== null) {
        window.clearTimeout(pendingClearTimerRef.current);
      }
      pendingClearTimerRef.current = window.setTimeout(() => {
        pendingAutoSaveRef.current = null;
        pendingClearTimerRef.current = null;
      }, 1500);
    }
    onApply(nextValue);
  };

  return (
    <section className="source-panel">
      <div className="source-panel__editor">
        <MonacoEditor
          ref={editorRef}
          height="100%"
          language={language}
          value={draft}
          autoSave={autoSave}
          showToolbar={showToolbar}
          formatOnLoad={formatOnLoad}
          onFormatOnLoad={(formattedValue) => {
            draftRef.current = formattedValue;
            savedDraftRef.current = formattedValue;
            setDraft(formattedValue);
            setSavedDraft(formattedValue);
          }}
          onSave={(nextValue) => {
            saveDraft(nextValue, true);
          }}
          onChange={(nextValue) => {
            const nextDraft = nextValue ?? "";
            if (externalFormatTimerRef.current !== null) {
              window.clearTimeout(externalFormatTimerRef.current);
              externalFormatTimerRef.current = null;
            }
            draftRef.current = nextDraft;
            setDraft(nextDraft);
          }}
          onMount={handleMount}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            automaticLayout: true,

            minimap: {
              enabled: false,
            },

            fontSize: 12,
            lineHeight: 19,

            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            foldingHighlight: true,

            scrollBeyondLastLine: false,
            smoothScrolling: true,

            wordWrap: "on",
            wrappingIndent: "indent",

            tabSize: 2,
            insertSpaces: true,

            formatOnPaste: true,
            formatOnType: true,

            renderWhitespace: "selection",

            overviewRulerBorder: false,

            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },

            padding: {
              top: 12,
              bottom: 12,
            },

            suggest: {
              showWords: true,
            },

            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
          }}
        >
          <div className="source-panel__editor-menu">
            <div className={`source-panel__heading w-64`}>
              <span className="source-panel__kicker">Source</span>
              <strong>{label}</strong>
              {dirty ? (
                <span className="source-panel__dirty">Unsaved</span>
              ) : null}
            </div>
            <div className="flex-1">
              <EditorMenu
                editorRef={editorRef}
                language={language}
                languages={[language]}
                title={`${label} editor menu`}
                onSave={
                  autoSave
                    ? undefined
                    : (nextValue) => {
                        saveDraft(nextValue, false);
                      }
                }
                onReset={handleReset}
              />
            </div>
          </div>
        </MonacoEditor>
      </div>

      {error ? (
        <div className="source-panel__error" role="alert">
          {error}
        </div>
      ) : null}
    </section>
  );
}
