import type { ReactNode } from "react";
import { useStudio } from "../../studio/StudioContext";
import { InTheWild } from "../InTheWild/InTheWild";
import {
  AboutLayout,
  InspectorSidebar,
} from "../InspectorSidebar/InspectorSidebar";
import { LayoutLibrary } from "../LayoutLibrary/LayoutLibrary";
import {
  PreviewVariantControls,
  StudioLivePreview,
  type PreviewViewport,
} from "../LivePreview/StudioLivePreview";
import { SourceEditor } from "../SourceEditor/SourceEditor";
import { SourceFiles } from "../SourceFiles/SourceFiles";
import { SourceLink } from "../SourceFiles/SourceLink";
import { StudioActions, StudioHeader } from "../StudioShell/StudioHeader";
import { WorkspaceTabs } from "../WorkspaceTabs/WorkspaceTabs";
import { PageHeading } from "./StudioPage";

const defaultViewports: PreviewViewport[] = [
  { id: "fluid", label: "Desktop", icon: "desktop" },
  { id: "768", label: "Tablet", width: 768, icon: "tablet" },
  { id: "375", label: "Phone", width: 375, icon: "phone" },
];

export function PresetToolbar({ homeTab }: { homeTab?: string }) {
  const { activePreset, setTab } = useStudio();
  return (
    <StudioHeader
      title="Layout Studio"
      breadcrumbs={[activePreset.editor?.category, activePreset.name]}
      homeTab={homeTab}
      onNavigate={setTab}
      actions={<StudioActions sources={activePreset.sources} />}
    />
  );
}

export function PresetLibrary() {
  const { groups, presetId, loadPreset, libraryOpen } = useStudio();
  return (
    <LayoutLibrary
      groups={groups}
      selectedId={presetId}
      onSelect={loadPreset}
      open={libraryOpen}
    />
  );
}

export function PresetPageTitle() {
  const { activePreset } = useStudio();
  return (
    <PageHeading>
      <h1>{activePreset.heading ?? activePreset.name}</h1>
      <PresetDescription />
    </PageHeading>
  );
}

export function PresetDescription() {
  const { activePreset } = useStudio();
  return activePreset.description ? <p>{activePreset.description}</p> : null;
}

export function PresetTabs({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: string;
}) {
  const { activePreset, tab, setTab } = useStudio();
  return (
    <WorkspaceTabs
      defaultValue={defaultValue}
      value={tab}
      onValueChange={setTab}
      suffix={activePreset.label}
    >
      {children}
    </WorkspaceTabs>
  );
}

export function PresetPreview({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}) {
  const { activePreset, activeLayout, presetId, loadPreset } = useStudio();
  return (
    <StudioLivePreview
      resizable
      title={title}
      sources={activePreset.sources}
      viewports={defaultViewports}
      height={activePreset.previewHeight}
      actions={children}
      controls={
        <PreviewVariantControls
          options={activeLayout.variants.map((variant) => ({
            id: variant.id,
            label: variant.label ?? variant.name,
          }))}
          value={presetId}
          onValueChange={loadPreset}
        />
      }
    />
  );
}

export function PresetSourceFiles({ targetTab }: { targetTab: string }) {
  const { activePreset, showSource } = useStudio();
  const sources = activePreset.sources.filter((source) => source.edit);
  return (
    <SourceFiles
      title={null}
      sources={sources}
      onOpen={(file) => showSource(file, targetTab)}
    >
      <ul>
        {sources.map((source) => (
          <li key={source.name}>
            <SourceLink href={`./${source.name}`}>
              {source.language === "html" || source.language === "css"
                ? source.language.toUpperCase()
                : source.name}
            </SourceLink>
          </li>
        ))}
      </ul>
    </SourceFiles>
  );
}

export function PresetSourceEditor() {
  const { activePreset } = useStudio();
  return (
    <SourceEditor
      sources={activePreset.sources.filter((source) => source.edit)}
    />
  );
}

export function PresetExamples({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  const { activePreset } = useStudio();
  return (
    <InTheWild title={title} examples={activePreset.inTheWild}>
      {children}
    </InTheWild>
  );
}

export function PresetInspector({ children }: { children?: ReactNode }) {
  return <InspectorSidebar footer={children} />;
}

export function PresetAbout({ targetTab }: { targetTab: string }) {
  const { setTab } = useStudio();
  return (
    <AboutLayout
      title="About this layout"
      description="Preview, guidance and examples from page.mdx"
      targetTab={targetTab}
      onNavigate={setTab}
    />
  );
}
