import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkFlexibleContainers from "remark-flexible-containers";
import type { PluggableList } from "unified";
import { customBlockOptions } from "./custom-blocks-options";
import { remarkDirectiveComponents } from "./remark-directive-components";

/** MoyaForge's neutral containers and component mapping, using MDX.js. */
export const mdxOptions = {
  remarkPlugins: [
    remarkFrontmatter,
    [remarkMdxFrontmatter, { name: "frontmatter" }],
    remarkGfm,
    [remarkFlexibleContainers, customBlockOptions],
    [
      remarkDirectiveComponents,
      {
        "code-group": {
          component: "CodeGroup",
          childType: "code-tab",
          childComponent: "CodeTab",
        },
        "workspace-tabs": {
          component: "PresetTabs",
          titleProp: "defaultValue",
        },
        "workspace-tab": {
          component: "WorkspacePanel",
          titleProp: "label",
          titleId: true,
        },
        "preview-layout": { component: "PresetPreview", titleProp: "title" },
        "source-editor": { component: "PresetSourceEditor" },
        "live-preview": { component: "LivePreview" },
        "source-files": {
          component: "SourceFiles",
          titleProp: "title",
          linkComponent: "SourceLink",
        },
        "in-the-wild": { component: "PresetExamples", titleProp: "title" },
        outline: { component: "DocumentOutline", titleProp: "title" },
        "*": { component: "CustomBlock", titleProp: "title", typeProp: "type" },
      },
    ],
  ] as PluggableList,
};
