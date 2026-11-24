import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import "./StudioPage.css";

export function PageHeading({ children }: { children: ReactNode }) {
  return (
    <header className="page-heading">
      <span className="page-badge">
        <FileText size={12} />
        page.mdx
      </span>
      {children}
    </header>
  );
}
export function DocumentationGrid({ children }: { children: ReactNode }) {
  return <div className="documentation-grid">{children}</div>;
}
export function Documentation({ children }: { children: ReactNode }) {
  return <article className="mdx-page">{children}</article>;
}
