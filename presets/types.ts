import type { EditorNodeId } from "../src/types";

export type InTheWildExample = {
  name: string;
  url?: string;
};

export type PresetSource = {
  id: string;
  name: string;
  description?: string;
  type?: "flex" | "grid";
  inTheWild?: InTheWildExample[];
  html: string;
  css: string;
  editor?: {
    category?: string;
    selectedNodeId?: EditorNodeId;
    canvas?: {
      width?: number;
      minHeight?: number;
    };
  };
};

