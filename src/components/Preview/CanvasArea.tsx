import { Boxes } from "lucide-react";
import type { EditorNodeId, EditorTheme } from "../../editor/types";
import { Preview, type SelectedPreviewElement } from "./Preview";
import "./CanvasArea.css";

type CanvasAreaProps = {
  className?: string;
  html: string;
  css: string;
  selectedId: EditorNodeId | null;
  selectedLabel: string | null;
  selection: SelectedPreviewElement | null;
  theme: EditorTheme;
  onSelect: (id: EditorNodeId) => void;
  onSelectedElement: (selection: SelectedPreviewElement | null) => void;
};

export function CanvasArea({
  className,
  html,
  css,
  selectedId,
  selectedLabel,
  selection,
  theme,
  onSelect,
  onSelectedElement,
}: CanvasAreaProps) {
  const layout = selection?.layout;

  return (
    <section className={`canvas-area ${className ?? ""}`}>
      <div className="canvas-area__toolbar">
        <div className="canvas-area__preview-title">
          <span className="canvas-area__status-dot" />
          <Boxes size={14} />
          Live preview
        </div>
        <div className="canvas-area__selection-crumb">
          <span>Selected</span>
          <code>{selectedLabel ?? "None"}</code>
        </div>
        {layout?.showLayoutUi ? (
          <span className={`canvas-area__layout-role ${layout.role === "item" ? "canvas-area__layout-role--item" : layout.role === "both" ? "canvas-area__layout-role--both" : ""}`}>
            {layout.role === "both"
              ? "Layout item + container"
              : `Layout ${layout.role}`}
          </span>
        ) : null}
      </div>
      <div className="canvas-area__scroll">
        <div className="canvas-area__frame">
          <Preview
            html={html}
            css={css}
            selectedId={selectedId}
            theme={theme}
            onSelect={onSelect}
            onSelectedElement={onSelectedElement}
          />
        </div>
      </div>
    </section>
  );
}
