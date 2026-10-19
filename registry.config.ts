import type { PresetRegistryConfig } from "./vite-plugins/preset-registry";

export default {
  sources: {
    layouts: { base: "./presets" },
  },
} satisfies PresetRegistryConfig;
