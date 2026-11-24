import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Play } from "lucide-react";
import "./LivePreview.css";

/** Presentation-only preview shell: content and toolbar controls belong to the caller. */
export function LivePreview({
  children,
  title = "Live preview",
  actions,
  controls,
  hint,
  status,
  height,
  width,
  device,
  resizable = false,
  minWidth = 280,
  maxWidth = 2560,
  onWidthChange,
  minHeight = 180,
  maxHeight = 1600,
  onSizeChange,
}: {
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  controls?: ReactNode;
  hint?: ReactNode;
  status?: ReactNode;
  height?: number;
  width?: number;
  device?: string;
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  minHeight?: number;
  maxHeight?: number;
  onSizeChange?: (size: { width: number; height: number }) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sizingKey = `${device ?? ""}:${width ?? "fluid"}:${height ?? "auto"}`;
  const [customSize, setCustomSize] = useState<{
    key: string;
    width: number;
    height: number;
  }>();
  const current = customSize?.key === sizingKey ? customSize : undefined;
  const actualWidth = current?.width ?? width;
  const actualHeight = current?.height ?? height;
  const measuredSize = () => ({
    width: actualWidth ?? viewportRef.current?.clientWidth ?? minWidth,
    height: actualHeight ?? viewportRef.current?.clientHeight ?? minHeight,
  });
  const changeSize = (next: { width: number; height: number }) => {
    const size = {
      width: Math.round(Math.max(minWidth, Math.min(maxWidth, next.width))),
      height: Math.round(Math.max(minHeight, Math.min(maxHeight, next.height))),
    };
    setCustomSize({ key: sizingKey, ...size });
    onWidthChange?.(size.width);
    onSizeChange?.(size);
  };
  return (
    <section className="live-card" aria-label="Interactive layout preview">
      <div className="live-toolbar">
        <strong>
          <Play size={16} />
          {title}
        </strong>
        {(actions || controls) && (
          <div className="preview-controls">
            {actions && <div className="live-actions">{actions}</div>}
            {controls}
          </div>
        )}
      </div>
      <div
        ref={viewportRef}
        className="live-viewport"
        data-device={device}
        style={
          {
            "--viewport-width": actualWidth ? `${actualWidth}px` : "100%",
            "--viewport-height":
              actualHeight === undefined ? undefined : `${actualHeight}px`,
          } as CSSProperties
        }
      >
        <div className="live-viewport-content">{children}</div>
        {resizable &&
          (
            ["top-left", "top-right", "bottom-left", "bottom-right"] as const
          ).map((corner) => (
            <button
              type="button"
              key={corner}
              className={`viewport-resize-handle viewport-resize-handle--${corner}`}
              aria-label={`Resize preview ${corner}`}
              title="Drag to resize width and height. Use arrow keys for precision."
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                const size = measuredSize();
                Object.assign(event.currentTarget.dataset, {
                  startX: String(event.clientX),
                  startY: String(event.clientY),
                  startWidth: String(size.width),
                  startHeight: String(size.height),
                });
              }}
              onPointerMove={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId))
                  return;
                const data = event.currentTarget.dataset;
                changeSize({
                  width:
                    Number(data.startWidth) +
                    (event.clientX - Number(data.startX)) *
                      (corner.endsWith("left") ? -1 : 1),
                  height:
                    Number(data.startHeight) +
                    (event.clientY - Number(data.startY)) *
                      (corner.startsWith("top") ? -1 : 1),
                });
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                    event.key,
                  )
                )
                  return;
                event.preventDefault();
                const size = measuredSize();
                const step = event.shiftKey ? 50 : 10;
                const horizontal =
                  event.key === "ArrowLeft" || event.key === "ArrowRight";
                const direction =
                  event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
                changeSize({
                  width:
                    size.width +
                    (horizontal
                      ? direction * step * (corner.endsWith("left") ? -1 : 1)
                      : 0),
                  height:
                    size.height +
                    (!horizontal
                      ? direction * step * (corner.startsWith("top") ? -1 : 1)
                      : 0),
                });
              }}
            />
          ))}
      </div>
      {(hint || status) && (
        <div className="live-footer">
          {hint && (
            <span>
              <span className="status-dot" />
              {hint}
            </span>
          )}
          {status && <code>{status}</code>}
        </div>
      )}
    </section>
  );
}
