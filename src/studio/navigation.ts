import { PRESETS } from "../../presets";
export type RegisteredPreset = (typeof PRESETS)[number];
export function layoutName(name: string) {
  return name.replace(/\s*-\s*(Flex|Grid)$/i, "");
}
export function getLayoutGroups() {
  const categories = new Map<
    string,
    { label: string; layouts: Map<string, typeof PRESETS> }
  >();
  for (const preset of PRESETS) {
    const parts = preset.path.split("/");
    const categoryKey = `${preset.source}/${parts[0]}`;
    const layoutKey = `${categoryKey}/${parts.slice(1, -1).join("/")}`;
    if (!categories.has(categoryKey))
      categories.set(categoryKey, {
        label: preset.editor?.category ?? parts[0],
        layouts: new Map(),
      });
    const layouts = categories.get(categoryKey)!.layouts;
    if (!layouts.has(layoutKey)) layouts.set(layoutKey, []);
    layouts.get(layoutKey)!.push(preset);
  }
  return [...categories].map(([key, category]) => ({
    key,
    label: category.label,
    layouts: [...category.layouts].map(([key, variants]) => ({
      key,
      variants,
      name: layoutName(variants[0].name),
    })),
  }));
}

export const layoutGroups = getLayoutGroups();
