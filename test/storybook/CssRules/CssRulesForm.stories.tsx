import type { Meta, StoryObj } from "@storybook/react-vite";
import { getCssRules } from "../../../src/editor/declarations";
import { CssRulesForm } from "./CssRulesForm";

import css from "../../css-v1.css?raw";

const defaultRules = getCssRules(css);

const meta = {
  title: "CSS Generator/CssRulesForm",
  component: CssRulesForm,

  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "editor" },
  },

  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", padding: 32, background: "#090b10" }}>
        <Story />
      </div>
    ),
  ],

  args: {
    rules: defaultRules,
  },
} satisfies Meta<typeof CssRulesForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FlexShorthand: Story = {
  args: {
    rules: getCssRules(`
      .item {
        flex: 16 1 0;
      }
    `),
  },
};

export const ShorthandWithLonghandOverride: Story = {
  args: {
    rules: getCssRules(`
      .item {
        flex: 1 1 0;
        flex-grow: 4;
      }
    `),
  },
};

export const MultipleSelectors: Story = {
  args: {
    rules: getCssRules(`
      .item-2,
      .item-3,
      .item-4 {
        height: calc(100% - 192px);
        min-height: 0;
      }

      .item-2 {
        flex: 16 1 0;
      }

      .item-3 {
        flex: 62 1 0;
      }

      .item-4 {
        flex: 16 1 0;
      }
    `),
  },
};

export const FlexContainer: Story = {
  args: {
    rules: getCssRules(`
      .container {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        gap: 16px;
        padding: 24px;
        align-content: flex-start;
      }
    `),
  },
};

export const ImportantDeclarations: Story = {
  args: {
    rules: getCssRules(`
      .item {
        flex: 1 1 0 !important;
        min-width: 0;
      }
    `),
  },
};

export const CustomProperties: Story = {
  args: {
    rules: getCssRules(`
      .container {
        --layout-gap: 16px;
        --sidebar-width: 16%;

        display: flex;
        gap: var(--layout-gap);
      }
    `),
  },
};
