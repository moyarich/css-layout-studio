import type { ReactNode } from "react";
import { useStudio } from "../../studio/StudioContext";
import { DocumentOutline } from "../DocumentOutline/DocumentOutline";
import { InTheWild } from "../InTheWild/InTheWild";
import { AboutLayout, InspectorSidebar } from "../InspectorSidebar/InspectorSidebar";
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
import { StudioBody, StudioShell, StudioToast, Workspace } from "../StudioShell/StudioShell";
import { WorkspacePanel, WorkspaceTabs } from "../WorkspaceTabs/WorkspaceTabs";
import { Documentation, DocumentationGrid, PageHeading } from "./StudioPage";

const defaultViewports: PreviewViewport[] = [
  { id: "fluid", label: "Desktop", icon: "desktop" },
  { id: "768", label: "Tablet", width: 768, icon: "tablet" },
  { id: "375", label: "Phone", width: 375, icon: "phone" },
];

export function PresetPage({ children }: { children: ReactNode }) {
  const studio = useStudio();
  const { activePreset, activeLayout, presetId, loadPreset, setTab } = studio;
  const { sources, description, heading, name, editor, label, inTheWild, previewHeight } =
    activePreset;
  const editableSources = sources.filter((source) => source.edit);
  const previewProps = {
    resizable: true,
    sources,
    viewports: defaultViewports,
    height: previewHeight,
    controls: (
      <PreviewVariantControls
        options={activeLayout.variants.map((variant) => ({
          id: variant.id,
          label: variant.label ?? variant.name,
        }))}
        value={presetId}
        onValueChange={loadPreset}
      />
    ),
  };

  return (
    <StudioShell>
      <StudioHeader
        title="Layout Studio"
        breadcrumbs={[editor?.category, name]}
        homeTab="playground"
        onNavigate={setTab}
        actions={<StudioActions sources={sources} />}
      />
      <StudioBody>
        <LayoutLibrary
          groups={studio.groups}
          selectedId={presetId}
          onSelect={loadPreset}
          open={studio.libraryOpen}
        />
        <Workspace>
          <PageHeading>
            <h1>{heading ?? name}</h1>
            {description && <p>{description}</p>}
          </PageHeading>
          <WorkspaceTabs
            defaultValue="playground"
            value={studio.tab}
            onValueChange={setTab}
            suffix={label}
          >
            <WorkspacePanel id="overview" label="Overview">
              <DocumentOutline title="Document outline" />
              <StudioLivePreview {...previewProps} />
              <Documentation>
                <DocumentationGrid>
                  <section>
                    <h2>How it works</h2>
                    {description && <p>{description}</p>}
                    <p>
                      Use Playground to edit the HTML and CSS, select regions in
                      the live preview, and compare the Flexbox and Grid implementations.
                    </p>
                    {children}
                  </section>
                  <InTheWild title="In the wild" examples={inTheWild} />
                </DocumentationGrid>
              </Documentation>
            </WorkspacePanel>
            <WorkspacePanel id="playground" label="Playground">
              <StudioLivePreview
                {...previewProps}
                actions={
                  <SourceFiles
                    title={null}
                    sources={editableSources}
                    onOpen={(file) => studio.showSource(file, "playground")}
                  >
                    <ul>
                      {editableSources.map((source) => (
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
                }
              />
              <SourceEditor sources={editableSources} />
            </WorkspacePanel>
          </WorkspaceTabs>
        </Workspace>
        <InspectorSidebar
          footer={
            <AboutLayout
              title="About this layout"
              description="Preview, guidance and examples from page.mdx"
              targetTab="overview"
              onNavigate={setTab}
            />
          }
        />
      </StudioBody>
      <StudioToast />
    </StudioShell>
  );
}
