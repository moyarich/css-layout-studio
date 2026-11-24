import type { ReactNode } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { LivePreview } from "./LivePreview";
import { CanvasArea } from "../Preview/CanvasArea";
import { preferredSelector } from "../../editor/html";
import type { PageSource } from "../../studio/source-types";
import { useStudio } from "../../studio/StudioContext";
import "./LivePreview.css";
export interface PreviewViewport {
  id: string;
  label: string;
  width?: number;
  icon?: "desktop" | "tablet" | "phone";
}
export function StudioLivePreview({
  resizable = false,
  height,
  actions,
  sources,
  controls,
  viewports = [],
  defaultViewport,
  title = "Live preview",
  hint = "Select any region to adjust its layout in the inspector. HTML and CSS edits update the preview immediately.",
}: {
  resizable?: boolean;
  height?: number;
  actions?: ReactNode;
  sources: readonly PageSource[];
  controls?: ReactNode;
  viewports?: readonly PreviewViewport[];
  defaultViewport?: string;
  title?: string;
  hint?: string;
}) {
  const {
    device,
    setDevice,
    previewHtml,
    previewCss,
    document,
    selectedHastElement,
    previewSelection,
    theme,
    selectNode,
    refreshComputed,
  } = useStudio();
  const viewport =
    viewports.find((viewport) => viewport.id === device) ??
    viewports.find((viewport) => viewport.id === defaultViewport) ??
    viewports[0];
  const html = sources.find((source) => source.language === "html");
  const css = sources.find((source) => source.language === "css");
  return (
    <LivePreview
      resizable={resizable}
      title={title}
      hint={hint}
      height={height}
      width={viewport?.width}
      device={viewport?.id}
      actions={actions}
      controls={
        <>
          {controls}
          <PreviewViewportControls
            viewports={viewports}
            value={viewport?.id}
            onValueChange={setDevice}
          />
        </>
      }
      status={
        selectedHastElement
          ? preferredSelector(selectedHastElement)
          : ".container"
      }
    >
      <CanvasArea
        html={html?.edit ? previewHtml : (html?.code ?? "")}
        css={css?.edit ? previewCss : (css?.code ?? "")}
        selectedId={document.selectedNodeId}
        selectedLabel={
          selectedHastElement ? preferredSelector(selectedHastElement) : null
        }
        selection={previewSelection}
        theme={theme}
        onSelect={selectNode}
        onSelectedElement={refreshComputed}
      />
    </LivePreview>
  );
}

export function PreviewVariantControls({
  options,
  value,
  onValueChange,
}: {
  options: readonly { id: string; label: string }[];
  value?: string;
  onValueChange: (id: string) => void;
}) {
  return options.length ? (
    <div className="segmented" role="group" aria-label="Layout implementation">
      {options.map((option) => (
        <button
          key={option.id}
          aria-pressed={option.id === value}
          onClick={() => onValueChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ) : null;
}

export function PreviewViewportControls({
  viewports,
  value,
  onValueChange,
}: {
  viewports: readonly PreviewViewport[];
  value?: string;
  onValueChange: (id: string) => void;
}) {
  const icons = { desktop: Monitor, tablet: Tablet, phone: Smartphone };
  const viewport = viewports.find((item) => item.id === value);
  return viewports.length ? (
    <div className="viewport-controls">
      <div
        className="segmented devices"
        role="group"
        aria-label="Preview viewport"
      >
        {viewports.map(({ id, label, icon }) => {
          const Icon = icons[icon ?? "desktop"];
          return (
            <button
              key={id}
              title={label}
              aria-label={label}
              aria-pressed={id === value}
              onClick={() => onValueChange(id)}
            >
              <Icon size={16} />
              <span className="device-label">{label}</span>
            </button>
          );
        })}
      </div>
      <span className="viewport-label">
        {viewport?.width ? `${viewport.width} px` : "Responsive"}
      </span>
    </div>
  ) : null;
}
