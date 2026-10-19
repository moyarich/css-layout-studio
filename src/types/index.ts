export type EditorNodeId = `node_${string}`;
export type EditorTheme = "light" | "dark";

export type LayoutRole = "none" | "container" | "item" | "both";

export type LayoutKind = "flex" | "inline-flex" | "grid" | "inline-grid" | null;

export type ElementLayoutInfo = {
  role: LayoutRole;

  isContainer: boolean;
  isItem: boolean;

  containerKind: LayoutKind;
  parentContainerKind: LayoutKind;

  showLayoutUi: boolean;
  showContainerUi: boolean;
  showItemUi: boolean;
};
