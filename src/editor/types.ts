import type { Root, Element, Data } from "hast";
import type { StyleSheet } from "css-tree";
import { EditorNodeId } from "../types";
export type { EditorNodeId, EditorTheme } from "../types";
export type { PresetSource } from "../presets";

export type EditorNodeData = Data & {
  editorId?: EditorNodeId;
};

export type EditorElement = Omit<Element, "data"> & {
  data?: EditorNodeData;
};

export type EditorDocument = {
  htmlAst: Root;
  cssAst: StyleSheet;
  selectedNodeId: EditorNodeId | null;
  revision: number;
};

export type SourceError = {
  panel: "html" | "css";
  message: string;
} | null;

export type ComputedSnapshot = Record<string, string>;
