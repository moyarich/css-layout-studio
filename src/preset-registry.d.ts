declare module "virtual:preset-registry" {
  export const registry: {
    entries: (import("../presets").PresetSource & {
      Page: import("react").ComponentType<{
        components?: Record<string, import("react").ComponentType<any>>;
      }>;
      sources: Record<string, string>;
      source: string;
      path: string;
      files: { metadata: string; html: string; css: string };
    })[];
  };
  export const PRESETS: typeof registry.entries;
}
