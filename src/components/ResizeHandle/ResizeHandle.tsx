import { useEffect, useRef } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import "./ResizeHandle.css";

type ResizeHandleProps = {
  className?: string;
  orientation: "vertical" | "horizontal";
  label: string;
  onResize: (delta: number) => void;
  onReset: () => void;
};

export function ResizeHandle({
  className,
  orientation,
  label,
  onResize,
  onReset,
}: ResizeHandleProps) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const axis = orientation === "vertical" ? "clientX" : "clientY";
    let previous = event[axis];
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = orientation === "vertical" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    event.currentTarget.dataset.dragging = "true";

    const handle = event.currentTarget;
    const move = (moveEvent: PointerEvent) => {
      const next = moveEvent[axis];
      onResize(next - previous);
      previous = next;
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      delete handle.dataset.dragging;
      cleanupRef.current = null;
    };

    cleanupRef.current = stop;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 48 : 16;
    const delta =
      orientation === "vertical"
        ? event.key === "ArrowLeft"
          ? -step
          : event.key === "ArrowRight"
            ? step
            : 0
        : event.key === "ArrowUp"
          ? -step
          : event.key === "ArrowDown"
            ? step
            : 0;

    if (delta) {
      event.preventDefault();
      onResize(delta);
    } else if (event.key === "Home") {
      event.preventDefault();
      onReset();
    }
  };

  return (
    <div
      className={`resize-handle ${orientation === "vertical" ? "resize-handle--vertical" : "resize-handle--horizontal"} ${className ?? ""}`}
      role="separator"
      aria-label={label}
      aria-orientation={orientation}
      tabIndex={0}
      title={`${label}. Drag or use arrow keys. Double-click to reset.`}
      onPointerDown={startResize}
      onKeyDown={handleKeyDown}
      onDoubleClick={onReset}
    >
      <span aria-hidden="true" />
    </div>
  );
}
