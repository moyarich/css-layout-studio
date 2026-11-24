import {
  PresetToolbar,
  PresetLibrary,
  PresetPageTitle,
  PresetDescription,
  PresetTabs,
  PresetPreview,
  PresetSourceFiles,
  PresetSourceEditor,
  PresetExamples,
  PresetInspector,
  PresetAbout,
} from "../components/StudioPage/PresetComponents";
import {
  StudioShell,
  StudioBody,
  Workspace,
  StudioToast,
} from "../components/StudioShell/StudioShell";
import {
  StudioHeader,
  StudioActions,
} from "../components/StudioShell/StudioHeader";
import { LayoutLibrary } from "../components/LayoutLibrary/LayoutLibrary";
import {
  PageHeading,
  DocumentationGrid,
  Documentation,
} from "../components/StudioPage/StudioPage";
import {
  WorkspaceTabs,
  WorkspacePanel,
} from "../components/WorkspaceTabs/WorkspaceTabs";
import {
  StudioLivePreview,
  PreviewVariantControls,
  PreviewViewportControls,
} from "../components/LivePreview/StudioLivePreview";
import { LivePreview } from "../components/LivePreview/LivePreview";
import { InTheWild } from "../components/InTheWild/InTheWild";
import { SourceEditor } from "../components/SourceEditor/SourceEditor";
import {
  DocumentOutline,
  OutlineWorkspace,
} from "../components/DocumentOutline/DocumentOutline";
import {
  InspectorSidebar,
  AboutLayout,
} from "../components/InspectorSidebar/InspectorSidebar";
import { CustomBlock } from "../components/ui/components/CustomBlock/CustomBlock";
import {
  CodeGroup,
  CodeTab,
} from "../components/ui/components/CodeGroup/CodeGroup";

import { SourceLink } from "../components/SourceFiles/SourceLink";
import { SourceFiles } from "../components/SourceFiles/SourceFiles";

// Components are capabilities. Their arrangement and presence belong to page.mdx.
export const studioMdxComponents = {
  PresetToolbar,
  PresetLibrary,
  PresetPageTitle,
  PresetDescription,
  PresetTabs,
  PresetPreview,
  PresetSourceFiles,
  PresetSourceEditor,
  PresetExamples,
  PresetInspector,
  PresetAbout,
  StudioShell,
  StudioBody,
  Workspace,
  StudioToast,
  StudioHeader,
  StudioActions,
  LayoutLibrary,
  PageHeading,
  DocumentationGrid,
  Documentation,
  WorkspaceTabs,
  WorkspacePanel,
  LivePreview,
  StudioLivePreview,
  PreviewVariantControls,
  PreviewViewportControls,
  InTheWild,
  SourceEditor,
  DocumentOutline,
  OutlineWorkspace,
  InspectorSidebar,
  AboutLayout,
  CustomBlock,
  CodeGroup,
  CodeTab,
  SourceFiles,
  SourceLink,
};
