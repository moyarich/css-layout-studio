import type { ReactNode } from "react";
import { FileText, ChevronRight } from "lucide-react";
import { Inspector } from "../Inspector/Inspector";
import { useStudio } from "../../studio/StudioContext";
import "./InspectorSidebar.css";
export function InspectorSidebar({
  title = "Inspector",
  footer,
}: {
  title?: string;
  footer?: ReactNode;
}) {
  const {
    document,
    selectedElement,
    computed,
    preferredRule,
    previewSelection,
    editDeclaration,
    resetDeclaration,
  } = useStudio();
  return (
    <aside className="studio-inspector" aria-label="Layout inspector">
      <div className="inspector-sidebar-heading">{title}</div>
      <div className="inspector-content">
        <Inspector
          cssAst={document.cssAst}
          revision={document.revision}
          selectedElement={selectedElement}
          computed={computed}
          preferredRule={preferredRule}
          layout={previewSelection?.layout ?? null}
          onChange={editDeclaration}
          onReset={resetDeclaration}
        />
      </div>
      {footer}
    </aside>
  );
}

export function AboutLayout({
  title,
  description,
  targetTab,
  onNavigate,
}: {
  title: string;
  description: string;
  targetTab: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <button className="about-layout" onClick={() => onNavigate(targetTab)}>
      <span className="about-icon">
        <FileText size={21} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <ChevronRight size={15} />
    </button>
  );
}
