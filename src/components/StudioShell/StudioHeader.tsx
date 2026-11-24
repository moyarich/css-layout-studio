import type { ReactNode } from "react";
import {
  Boxes,
  Layers,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  Copy,
  Download,
} from "lucide-react";
import { useStudio } from "../../studio/StudioContext";
import type { PageSource } from "../../studio/source-types";
import "./StudioHeader.css";
export function StudioHeader({
  title = "Layout Studio",
  breadcrumbs = [],
  homeTab,
  onNavigate,
  actions,
}: {
  title?: string;
  breadcrumbs?: ReactNode[];
  homeTab?: string;
  onNavigate?: (id: string) => void;
  actions?: ReactNode;
}) {
  return (
    <header className="studio-header">
      <a
        className="studio-brand"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          if (homeTab) onNavigate?.(homeTab);
        }}
      >
        <Boxes size={26} />
        <strong>{title}</strong>
      </a>
      <div className="studio-breadcrumb">
        <Layers size={16} />
        <ChevronRight size={14} />
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && <span aria-hidden="true"> / </span>}
            {index === breadcrumbs.length - 1 ? (
              <strong>{crumb}</strong>
            ) : (
              crumb
            )}
          </span>
        ))}
      </div>
      <div className="studio-actions">{actions}</div>
    </header>
  );
}
/** Shared actions are available as an explicit, configurable header slot. */
export function StudioActions({
  sources,
  library = true,
  theme = true,
  copy = true,
  download = true,
}: {
  sources: readonly PageSource[];
  library?: boolean;
  theme?: boolean;
  copy?: boolean;
  download?: boolean;
}) {
  const studio = useStudio();
  return (
    <>
      {library && (
        <button
          className="icon-button mobile-library-toggle"
          aria-label="Toggle layout library"
          onClick={() => studio.setLibraryOpen(!studio.libraryOpen)}
        >
          {studio.libraryOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelLeftOpen size={18} />
          )}
        </button>
      )}
      {theme && (
        <button
          className="icon-button"
          aria-label="Toggle color theme"
          onClick={() =>
            studio.setTheme(studio.theme === "light" ? "dark" : "light")
          }
        >
          {studio.theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      )}
      {copy && (
        <button
          className="studio-button copy-button"
          onClick={studio.copyExport}
        >
          <Copy size={15} />
          Copy code
        </button>
      )}
      {download && (
        <button
          className="studio-button primary"
          onClick={() => studio.exportFolder(sources)}
        >
          <Download size={15} />
          Export folder
        </button>
      )}
    </>
  );
}
