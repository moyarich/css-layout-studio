import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Inspector } from "../components/Inspector/Inspector";
import { parseCssSource } from "../editor/css";
import { ElementLayoutInfo } from "../types";

const cssAst = parseCssSource(`
  .selected {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column: 2 / span 4;
    gap: 16px;
    padding: 24px;
    background: #182234;
    color: #f8fafc;
  }
`);

const selectedElement = document.createElement("section");
selectedElement.className = "selected";

const bothLayout: ElementLayoutInfo = {
  role: "both",
  isContainer: true,
  isItem: true,
  containerKind: "grid",
  parentContainerKind: "grid",
  showLayoutUi: true,
  showContainerUi: true,
  showItemUi: true,
};

const meta = {
  title: "CSS Generator/Inspector",
  component: Inspector,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 320,
          maxHeight: 800,
          overflow: "auto",
          background: "#10131a",
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    cssAst,
    revision: 0,
    selectedElement,
    preferredRule: null,
    layout: bothLayout,
    computed: {
      display: "grid",
      "grid-template-columns": "160px 160px 160px",
      "grid-column": "2 / span 4",
      gap: "16px",
      padding: "24px",
      background: "rgb(24, 34, 52)",
      color: "rgb(248, 250, 252)",
    },
    onChange: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof Inspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GridItemAndContainer: Story = {};

export const FlexItem: Story = {
  args: {
    layout: {
      ...bothLayout,
      role: "item",
      isContainer: false,
      containerKind: null,
      parentContainerKind: "flex",
      showContainerUi: false,
    },
    computed: { display: "block", "flex-grow": "1", "flex-basis": "0px" },
  },
};

export const ExcludedFields: Story = {
  args: {
    fieldVisibility: [
      { section: "typography", hidden: true },
      { section: "boxModel", field: "overflow", hidden: true },
      { section: "appearance", field: "opacity", hidden: true },
    ],
  },
};

export const AllSectionsHidden: Story = {
  args: {
    fieldVisibility: [{ section: "*", hidden: true }],
  },
};
