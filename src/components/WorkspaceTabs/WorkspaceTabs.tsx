import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import "./WorkspaceTabs.css";

export interface WorkspacePanelProps {
  id: string;
  label: string;
  children: ReactNode;
}
export function WorkspacePanel({ children }: WorkspacePanelProps) {
  return <>{children}</>;
}

/** Tabs and their panels are authored in MDX; no application tab list is hardcoded. */
export function WorkspaceTabs({
  children,
  defaultValue,
  value,
  onValueChange,
  suffix,
}: {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
  suffix?: ReactNode;
}) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const tab = value ?? localValue;
  function setTab(id: string) {
    setLocalValue(id);
    onValueChange?.(id);
  }
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<WorkspacePanelProps> =>
      isValidElement<WorkspacePanelProps>(child) &&
      typeof child.props.label === "string",
  );
  const active = panels.findIndex((panel) => panel.props.id === tab);
  const fallback = panels.findIndex((panel) => panel.props.id === defaultValue);
  const selected = active < 0 ? Math.max(0, fallback) : active;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % panels.length
        : event.key === "ArrowLeft"
          ? (index - 1 + panels.length) % panels.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? panels.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    setTab(panels[next].props.id);
    root.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus();
  }
  if (!panels.length) return null;
  return (
    <div
      ref={root}
      className="workspace-tabs-root"
      data-active-tab={panels[selected]?.props.id}
    >
      <div className="workspace-tabs" role="tablist" aria-label="Workspace">
        {panels.map((panel, index) => (
          <button
            key={panel.props.id}
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onKeyDown={(event) => navigate(event, index)}
            onClick={() => setTab(panel.props.id)}
          >
            {panel.props.label}
          </button>
        ))}
        {suffix && <span className="workspace-path">{suffix}</span>}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel-${selected}`}
        aria-labelledby={`${id}-tab-${selected}`}
      >
        {panels[selected]}
      </div>
    </div>
  );
}
