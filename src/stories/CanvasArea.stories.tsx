import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CanvasArea } from "../components/Preview/CanvasArea";
import type { SelectedPreviewElement } from "../components/Preview/Preview";
import type { EditorNodeId } from "../editor/types";
import type { EditorTheme } from "../editor/types";

const html = `
  <main class="dashboard" data-editor-id="node_dashboard">
    <aside class="sidebar" data-editor-id="node_sidebar">Navigation</aside>
    <section class="content" data-editor-id="node_content">
      <article data-editor-id="node_card_1">Revenue</article>
      <article data-editor-id="node_card_2">Customers</article>
      <article data-editor-id="node_card_3">Conversion</article>
    </section>
  </main>`;

const css = `
  .dashboard { display: grid; grid-template-columns: 180px 1fr; gap: 18px; min-height: 540px; padding: 24px; background: #111827; color: #f8fafc; }
  .sidebar { padding: 20px; border-radius: 14px; background: #1f2937; }
  .content { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  article { min-height: 160px; padding: 18px; border: 1px solid #334155; border-radius: 14px; background: #182234; }
`;

const labels: Record<string, string> = {
  node_dashboard: ".dashboard",
  node_sidebar: ".sidebar",
  node_content: ".content",
  node_card_1: "article:first-child",
  node_card_2: "article:nth-child(2)",
  node_card_3: "article:nth-child(3)",
};

type CanvasStoryProps = {
  html: string;
  css: string;
  initialSelectedId: EditorNodeId;
  selectedLabel?: string;
  theme: EditorTheme;
};

function CanvasStory({ html, css, initialSelectedId, selectedLabel, theme }: CanvasStoryProps) {
  const [selectedId, setSelectedId] = useState<EditorNodeId>(initialSelectedId);
  const [selection, setSelection] = useState<SelectedPreviewElement | null>(null);

  useEffect(() => setSelectedId(initialSelectedId), [initialSelectedId]);

  return (
    <div style={{ height: 760, display: "grid" }}>
      <CanvasArea
        html={html}
        css={css}
        selectedId={selectedId}
        selectedLabel={selectedLabel || labels[selectedId] || null}
        selection={selection}
        theme={theme}
        onSelect={setSelectedId}
        onSelectedElement={setSelection}
      />
    </div>
  );
}

const meta = {
  title: "CSS Generator/CanvasArea",
  component: CanvasStory,
  parameters: { layout: "fullscreen" },
  argTypes: {
    html: { control: "text" },
    css: { control: "text" },
    initialSelectedId: { control: "text" },
    selectedLabel: { control: "text" },
    theme: { control: "inline-radio", options: ["light", "dark"] },
  },
  args: {
    html,
    css,
    initialSelectedId: "node_content",
    selectedLabel: "",
    theme: "dark",
  },
} satisfies Meta<typeof CanvasStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedGridContainer: Story = {};

export const DashboardRoot: Story = {
  args: { initialSelectedId: "node_dashboard" },
};
