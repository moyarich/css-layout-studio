declare module "virtual:preset-registry" {
  export const registry: {
    entries: (import("../presets").PresetSource & {
      Page: import("react").ComponentType<{
        studio?: object;
        components?: Record<string, import("react").ComponentType<any>>;
      }>;
      sources: import("./studio/source-types").PageSource[];
      source: string;
      path: string;
      files: { page: string; html: string; css: string };
    })[];
  };
  export const PRESETS: typeof registry.entries;
}
