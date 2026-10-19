declare module "virtual:preset-registry" {
  export const registry: {
    entries: (import("../presets").PresetSource & {
      source: string;
      path: string;
      files: { metadata: string; html: string; css: string };
    })[];
  };
  export const PRESETS: typeof registry.entries;
}
