import type { Root } from "mdast";

/** Map authored directive types to host-registered MDX components. */
export interface DirectiveComponent {
  component: string;
  /** Optional nested directive, such as tab within code-group. */
  childType?: string;
  childComponent?: string;
  /** Attribute receiving the directive's optional heading. Defaults to label. */
  titleProp?: string;
  /** Allow a stable identifier before the title, separated by a pipe. */
  titleId?: boolean;
  /** Forward the authored directive type to a generic component. */
  typeProp?: string;
  /** Replace Markdown links only inside this directive. */
  linkComponent?: string;
}

export type DirectiveComponentMap = Record<string, DirectiveComponent>;

type Node = {
  type: string;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown> };
  value?: string;
  url?: string;
  title?: string | null;
};
type Attribute = { type: "mdxJsxAttribute"; name: string; value: string };

function titleOf(node: Node): string {
  if (node.value) return node.value;
  return (node.children ?? []).map(titleOf).join("");
}

function directiveType(node: Node): string | undefined {
  if (node.type !== "container") return;
  const type = node.data?.hProperties?.["data-type"];
  return typeof type === "string" ? type : undefined;
}

function jsx(
  name: string,
  content: Node[],
  attributes: Attribute[],
  inline = false,
): Node {
  return {
    type: inline ? "mdxJsxTextElement" : "mdxJsxFlowElement",
    name,
    attributes,
    children: content,
  } as unknown as Node;
}

function transform(
  node: Node,
  mappings: DirectiveComponentMap,
  childType?: string,
  childComponent?: string,
  linkComponent?: string,
): Node {
  if (node.type === "link" && linkComponent) {
    const attributes: Attribute[] = [
      { type: "mdxJsxAttribute", name: "href", value: node.url ?? "" },
    ];
    if (node.title)
      attributes.push({
        type: "mdxJsxAttribute",
        name: "title",
        value: node.title,
      });
    return jsx(linkComponent, node.children ?? [], attributes, true);
  }
  // JSX scopes use the same mapping as directives, while keeping authored props.
  if (node.type === "mdxJsxFlowElement") {
    const scope = Object.values(mappings).find(
      (mapping) =>
        mapping.component === (node as Node & { name?: string }).name,
    );
    if (node.children)
      node.children = node.children.map((child) =>
        transform(
          child,
          mappings,
          undefined,
          undefined,
          scope?.linkComponent ?? linkComponent,
        ),
      );
    return node;
  }
  const type = directiveType(node);
  const nested = type === childType && Boolean(childComponent);
  const definition = type
    ? (mappings[type] ?? (nested ? undefined : mappings["*"]))
    : undefined;
  if (definition || (type === childType && childComponent)) {
    const selected = definition ?? { component: childComponent! };
    const children = [...(node.children ?? [])];
    const first = children[0];
    const cls = first?.data?.hProperties?.className;
    const classes = Array.isArray(cls)
      ? cls
      : typeof cls === "string"
        ? cls.split(/\s+/)
        : [];
    const title = classes.includes("custom-block-title")
      ? titleOf(children.shift()!)
      : undefined;
    const [id, label] =
      selected.titleId && title?.includes("|")
        ? [
            title.slice(0, title.indexOf("|")).trim(),
            title.slice(title.indexOf("|") + 1).trim(),
          ]
        : [title, title];
    const attributes: Attribute[] = label
      ? [
          {
            type: "mdxJsxAttribute",
            name: selected.titleProp ?? "label",
            value: label,
          },
        ]
      : [];
    if (selected.titleId && id) {
      attributes.push({ type: "mdxJsxAttribute", name: "id", value: id });
    }
    if (selected.typeProp && type) {
      attributes.push({
        type: "mdxJsxAttribute",
        name: selected.typeProp,
        value: type,
      });
    }
    return jsx(
      selected.component,
      children.map((child) =>
        transform(
          child,
          mappings,
          selected.childType,
          selected.childComponent,
          selected.linkComponent ?? linkComponent,
        ),
      ),
      attributes,
    );
  }
  if (node.children)
    node.children = node.children.map((child) =>
      transform(child, mappings, undefined, undefined, linkComponent),
    );
  return node;
}

/** Transform only configured directives; all others remain generic HTML containers. */
export function remarkDirectiveComponents(mappings: DirectiveComponentMap) {
  return (tree: Root) => {
    const root = tree as unknown as Node;
    root.children = (root.children ?? []).map((node) =>
      transform(node, mappings),
    );
  };
}
