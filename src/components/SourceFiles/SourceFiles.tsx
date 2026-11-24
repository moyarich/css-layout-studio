import { createContext, useContext, type ReactNode } from "react";
import type { PageSource } from "../../studio/source-types";
import "./SourceFiles.css";
export interface SourceActions {
  sources: readonly PageSource[];
  onOpen: (name: string) => void;
}
const SourceActionsContext = createContext<SourceActions | null>(null);
export function useSourceActions() {
  return useContext(SourceActionsContext);
}
/** Explicit page props are shared only with the links nested in this block. */
export function SourceFiles({
  title = "Source Files",
  sources,
  onOpen,
  children,
}: SourceActions & { title?: ReactNode; children?: ReactNode }) {
  return (
    <SourceActionsContext.Provider value={{ sources, onOpen }}>
      <section className="source-files">
        {title && <h2>{title}</h2>}
        {children}
      </section>
    </SourceActionsContext.Provider>
  );
}
