import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import Editor from "@monaco-editor/react";
import type { EditorProps, Monaco, OnMount } from "@monaco-editor/react";
import { useDebouncedCallback } from "../../hooks/useDebounce";

export type MonacoStandaloneEditor = Parameters<OnMount>[0];

export type MonacoLanguage = {
  id: string;
  aliases?: string[];
  extensions?: string[];
  filenames?: string[];
  mimetypes?: string[];
};

export type MonacoEditorHandle = {
  getEditor: () => MonacoStandaloneEditor | null;
  getMonaco: () => Monaco | null;
  getLanguageOptions: () => string[];
  undo: () => void;
  redo: () => void;
  focus: () => void;
  copy: () => Promise<void>;
  format: () => Promise<void>;
  cancelPendingSave: () => void;
};

export interface MonacoEditorProps extends EditorProps {
  children?: ReactNode;
  onLanguageOptionsLoaded?: (languageOptions: string[]) => void;
  /** Saves after the user pauses typing. Enabled by default when onSave is provided. */
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSave?: (value: string) => void;
  /** Controls the optional menu supplied as children. */
  showToolbar?: boolean;
  /** Formats once when Monaco finishes measuring its initial content. */
  formatOnLoad?: boolean;
  onFormatOnLoad?: (value: string) => void;
}

export const MonacoEditor = forwardRef<MonacoEditorHandle, MonacoEditorProps>(
  (
    {
      theme = "vs-light",
      height = "520px",
      options,
      children,
      onMount,
      onChange,
      value,
      defaultValue,
      onLanguageOptionsLoaded,
      autoSave = true,
      autoSaveDelay = 600,
      onSave,
      showToolbar = true,
      formatOnLoad = true,
      onFormatOnLoad,

      ...editorProps
    },
    ref,
  ) => {
    const editorRef = useRef<MonacoStandaloneEditor | null>(null);
    const initialValueRef = useRef(value ?? defaultValue);
    const containerRef = useRef<HTMLElement | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const initialFormatTimerRef = useRef<number | null>(null);
    const initialFormatDoneRef = useRef(false);
    const suppressChangesRef = useRef(false);
    const languageOptionsRef = useRef<string[]>([]);
    const [languageOptions, setLanguageOptions] = useState<string[]>([]);

    const mergedOptions = useMemo(
      () => ({
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on" as const,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        formatOnType: true,
        ...options,
      }),
      [options],
    );

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container || typeof ResizeObserver === "undefined") return;

      let animationFrame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() =>
          editorRef.current?.layout(),
        );
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(animationFrame);
      };
    }, []);

    useLayoutEffect(() => {
      const editor = editorRef.current;
      if (
        value === undefined ||
        !editor ||
        (formatOnLoad && !initialFormatDoneRef.current) ||
        editor.getValue() === value
      ) return;

      // Synchronize genuine external changes without feeding every keystroke
      // back through @monaco-editor/react's controlled-value path.
      const position = editor.getPosition();
      suppressChangesRef.current = true;
      try {
        editor.setValue(value);
      } finally {
        suppressChangesRef.current = false;
      }
      if (position) {
        const model = editor.getModel();
        const lineNumber = Math.min(position.lineNumber, model?.getLineCount() ?? 1);
        const column = Math.min(
          position.column,
          (model?.getLineMaxColumn(lineNumber) ?? 1),
        );
        editor.setPosition({ lineNumber, column });
      }
    }, [formatOnLoad, value]);

    useLayoutEffect(
      () => () => {
        if (initialFormatTimerRef.current !== null)
          window.clearTimeout(initialFormatTimerRef.current);
      },
      [],
    );

    const debouncedSave = useDebouncedCallback(
      (value: string) => onSave?.(value),
      autoSaveDelay,
    );

    const handleChange: NonNullable<EditorProps["onChange"]> = (
      value,
      event,
    ) => {
      // Formatting and external synchronization are presentation changes, not
      // user edits. Let their dedicated callback publish the final buffer once.
      if (suppressChangesRef.current) return;
      onChange?.(value, event);
      if (!autoSave || !onSave) return;

      debouncedSave(value ?? "");
    };

    const handleMount: OnMount = async (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      initialFormatDoneRef.current = !formatOnLoad;
      const initialContent = editor.getValue();

      const allLangs: MonacoLanguage[] = monaco.languages.getLanguages();
      const languageOptions = buildLanguageOptionsFromIds(
        allLangs.map((lang) => lang.id),
      );
      languageOptionsRef.current = languageOptions;
      setLanguageOptions(languageOptions);
      onLanguageOptionsLoaded?.(languageOptions);
      onMount?.(editor, monaco);

      let formatAttempts = 0;
      const formatInitialContent = async () => {
        if (initialFormatDoneRef.current) return;
        // Never let a late formatter-provider registration rewrite text after
        // the user has begun editing.
        if (editor.getValue() !== initialContent) {
          initialFormatDoneRef.current = true;
          return;
        }
        const action = editor.getAction("editor.action.formatDocument");
        if (!action?.isSupported() && formatAttempts < 20) {
          formatAttempts += 1;
          initialFormatTimerRef.current = window.setTimeout(
            () => void formatInitialContent(),
            50,
          );
          return;
        }
        initialFormatDoneRef.current = true;
        suppressChangesRef.current = true;
        try {
          await action?.run();
          debouncedSave.cancel();
          onFormatOnLoad?.(editor.getValue());
        } finally {
          suppressChangesRef.current = false;
        }
      };

      // Explicit scheduling handles editors whose initial size was established
      // before onDidContentSizeChange could be subscribed. The size event stays
      // as a fallback, guarded so formatting runs only once.
      editor.onDidContentSizeChange(() => void formatInitialContent());
      initialFormatTimerRef.current = window.setTimeout(
        () => void formatInitialContent(),
        0,
      );
    };

    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => editorRef.current,
        getMonaco: () => monacoRef.current,
        getLanguageOptions: () => languageOptionsRef.current,
        undo: () => {
          editorRef.current?.focus();
          editorRef.current?.trigger("history-toolbar", "undo", null);
        },
        redo: () => {
          editorRef.current?.focus();
          editorRef.current?.trigger("history-toolbar", "redo", null);
        },
        focus: () => {
          editorRef.current?.focus();
        },
        copy: async () => {
          const value = editorRef.current?.getValue() ?? "";
          await navigator.clipboard.writeText(value);
        },
        format: async () => {
          editorRef.current?.focus();
          await editorRef.current
            ?.getAction("editor.action.formatDocument")
            ?.run();
        },
        cancelPendingSave: debouncedSave.cancel,
      }),
      [debouncedSave],
    );

    return (
      <section
        ref={containerRef}
        className="monaco-editor-shell overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
      >
        {showToolbar && children ? (
          <div className="border-b border-zinc-200 bg-zinc-50 p-2">
            {children}
          </div>
        ) : null}

        <Editor
          height={height}
          theme={theme}
          defaultValue={initialValueRef.current}
          options={mergedOptions}
          onMount={handleMount}
          onChange={handleChange}
          {...editorProps}
        />
      </section>
    );
  },
);

MonacoEditor.displayName = "MonacoEditor";

export function buildLanguageOptionsFromIds(languageIds: string[]) {
  return [...new Set(languageIds)].sort((a, b) => a.localeCompare(b));
}
