import type { Element, Root, RootContent } from "hast";
import { ChevronRight } from "lucide-react";
import type { EditorNodeId } from "../../editor/types";
import { getEditorId, getElementLabel } from "../../editor/html";
import "./MarkupTree.css";

function ElementRow({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: Element;
  depth: number;
  selectedId: EditorNodeId | null;
  onSelect: (id: EditorNodeId) => void;
}) {
  const id = getEditorId(node);
  const childElements = node.children.filter(
    (child): child is Element => child.type === "element",
  );

  return (
    <div>
      <button
        className={`markup-tree__row ${id === selectedId ? "is-selected" : ""}`}
        style={{ paddingLeft: 10 + depth * 14 }}
        onClick={() => id && onSelect(id)}
      >
        <ChevronRight
          size={13}
          className={childElements.length ? "" : "markup-tree__spacer"}
        />
        <span className="markup-tree__tag-bracket">&lt;</span>
        <span className="markup-tree__tag-name">{getElementLabel(node)}</span>
        <span className="markup-tree__tag-bracket">&gt;</span>
      </button>
      {childElements.map((child) => (
        <ElementRow
          key={getEditorId(child)}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function MarkupTree({
  root,
  selectedId,
  onSelect,
}: {
  root: Root;
  selectedId: EditorNodeId | null;
  onSelect: (id: EditorNodeId) => void;
}) {
  const elements = root.children.filter(
    (node: RootContent): node is Element => node.type === "element",
  );
  return (
    <div className="markup-tree">
      {elements.map((element) => (
        <ElementRow
          key={getEditorId(element)}
          node={element}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
