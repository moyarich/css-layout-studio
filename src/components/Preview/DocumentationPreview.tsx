import { createContext, type ReactNode } from "react";

// Documentation keeps its standalone preview; the editor supplies an editable one.
export const DocumentationPreviewContext = createContext<ReactNode>(null);
