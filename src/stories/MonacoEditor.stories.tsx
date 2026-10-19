import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditorMenu } from "../components/MonacoEditor/EditorMenu";
import { MonacoEditor, type MonacoEditorHandle } from "../components/MonacoEditor/MonacoEditor";

type MonacoStoryProps = {
  value: string;
  language: string;
  theme: "vs-dark" | "light";
  height: string;
  autoSave: boolean;
  showToolbar: boolean;
  formatOnLoad: boolean;
};

function MonacoStory({ value: controlledValue, language, theme, height, autoSave, showToolbar, formatOnLoad }: MonacoStoryProps) {
  const editorRef = useRef<MonacoEditorHandle>(null);
  const [value, setValue] = useState(controlledValue);

  useEffect(() => setValue(controlledValue), [controlledValue]);

  return (
    <div style={{ width: 760 }}>
      <MonacoEditor ref={editorRef} language={language} value={value} onChange={(next) => setValue(next ?? "")} onSave={setValue} autoSave={autoSave} showToolbar={showToolbar} formatOnLoad={formatOnLoad} height={height} theme={theme}>
        <EditorMenu editorRef={editorRef} language={language} languages={["css", "html", "javascript"]} onSave={autoSave ? undefined : setValue} onReset={() => setValue(controlledValue)} />
      </MonacoEditor>
    </div>
  );
}

const meta = {
  title: "CSS Generator/MonacoEditor",
  component: MonacoStory,
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: "text" },
    language: { control: "select", options: ["css", "html", "javascript"] },
    theme: { control: "select", options: ["vs-dark", "light"] },
    height: { control: "text" },
    autoSave: { control: "boolean" },
    showToolbar: { control: "boolean" },
    formatOnLoad: { control: "boolean" },
  },
  args: {
    value: `.card {\n  display: grid;\n  gap: 1rem;\n}`,
    language: "css",
    theme: "vs-dark",
    height: "420px",
    autoSave: true,
    showToolbar: true,
    formatOnLoad: true,
  },
} satisfies Meta<typeof MonacoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEditorMenu: Story = {};
