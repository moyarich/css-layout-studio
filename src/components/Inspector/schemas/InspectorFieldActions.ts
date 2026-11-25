import { createContext } from "react";

export const InspectorFieldActions = createContext<{
  host: HTMLDivElement | null;
} | null>(null);
