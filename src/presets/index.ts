import type { EditorNodeId } from "../editor/types";

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

type PresetModule = {
  presets?: PresetSource[];
};

const CATEGORY_ORDER = [
  "App",
  "Content",
  "Marketing",
  "Commerce",
  "Gallery",
  "Utility",
] as const;

/*
 * Every .ts file under this directory is discovered automatically.
 * Modules that export `presets` are included.
 */
const modules = import.meta.glob<PresetModule>(
  ["./**/*.preset.ts", "!./index.ts"],
  {
    eager: true,
  },
);

function getCategoryOrder(category: string) {
  const index = CATEGORY_ORDER.indexOf(
    category as (typeof CATEGORY_ORDER)[number],
  );

  return index === -1 ? CATEGORY_ORDER.length : index;
}

function getPairName(presets: PresetSource[]) {
  return (
    presets[0]?.name
      .replace(/\s*-\s*Flex$/i, "")
      .replace(/\s*-\s*Grid$/i, "") ?? ""
  );
}

const presetModules = Object.values(modules).filter(
  (module): module is { presets: PresetSource[] } =>
    Array.isArray(module.presets) && module.presets.length > 0,
);

export const PRESETS: PresetSource[] = presetModules
  .sort((a, b) => {
    const categoryA = a.presets[0]?.editor?.category ?? "";
    const categoryB = b.presets[0]?.editor?.category ?? "";

    // First: explicitly defined category order.
    const categoryCompare =
      getCategoryOrder(categoryA) - getCategoryOrder(categoryB);

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    // Second: alphabetical layout name within the category.
    return getPairName(a.presets).localeCompare(getPairName(b.presets));
  })
  // Preserve Flex/Grid order inside each preset file.
  .flatMap((module) => module.presets);
