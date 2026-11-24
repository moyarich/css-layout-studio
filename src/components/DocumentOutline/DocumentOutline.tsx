import type { ReactNode } from "react";
import { Layers } from "lucide-react";
import { MarkupTree } from "../MarkupTree/MarkupTree";
import { useStudio } from "../../studio/StudioContext";
import "./DocumentOutline.css";
export function DocumentOutline({
  title = "Document outline",
}: {
  title?: string;
}) {
  const { document, selectNode } = useStudio();
  return (
    <section className="outline-tree-panel">
      <div className="outline-heading">
        <Layers size={16} />
        {title}
      </div>
      <MarkupTree
        root={document.htmlAst}
        selectedId={document.selectedNodeId}
        onSelect={selectNode}
      />
    </section>
  );
}
export function OutlineWorkspace({ children }: { children: ReactNode }) {
  return <div className="outline-workspace">{children}</div>;
}
