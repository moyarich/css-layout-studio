import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../test/storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    define: {
      ...viteConfig.define,
      "process.env": JSON.stringify({
        NODE_ENV: "development",
        BStyle_CSSTREE_LOG_LEVEL: "ERROR",
      }),
    },
    resolve: {
      ...viteConfig.resolve,
      dedupe: [
        ...new Set([
          ...(viteConfig.resolve?.dedupe ?? []),
          "react",
          "react-dom",
        ]),
      ],
    },
  }),
};
export default config;
