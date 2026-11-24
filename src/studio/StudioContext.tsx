import { createContext, useContext, type ReactNode } from "react";
import { useStudioController } from "./useStudioController";
const StudioContext = createContext<ReturnType<
  typeof useStudioController
> | null>(null);
export function StudioProvider({ children }: { children: ReactNode }) {
  const studio = useStudioController();
  return (
    <StudioContext.Provider value={studio}>{children}</StudioContext.Provider>
  );
}
export function useStudio() {
  const studio = useContext(StudioContext);
  if (!studio) throw new Error("Studio blocks must be inside StudioProvider");
  return studio;
}
