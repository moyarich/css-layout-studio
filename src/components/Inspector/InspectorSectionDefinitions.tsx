// ============================================================================
// Flex Fields definitions
// ============================================================================

import { LayoutKind, ElementLayoutInfo } from "../../types";
import {
  DISPLAY_FIELDS,
  WIDTH_FIELDS,
  HEIGHT_FIELDS,
  INLINE_SIZE_FIELDS,
  BLOCK_SIZE_FIELDS,
  SIZE_BEHAVIOR_FIELDS,
  MARGIN_FIELDS,
  PADDING_FIELDS,
  POSITIONING_FIELDS,
  OVERFLOW_FIELDS,
  FONT_FIELDS,
  TEXT_FIELDS,
  FLOW_FIELDS,
  TRANSFORM_FIELDS,
  INTERACTION_FIELDS,
  BACKGROUND_FIELDS,
  BORDER_FIELDS,
  BORDER_RADIUS_FIELDS,
  EFFECTS_FIELDS,
  OUTLINE_FIELDS,
  FLEX_CONTAINER_FIELDS,
  FLEX_ITEM_FIELDS,
  GRID_CONTAINER_FIELDS,
  GRID_ITEM_FIELDS,
} from "./CSSFields";

import {
  InspectorSectionDefinition,
  INSPECTOR_FIELD_IDS,
} from "./inspector-model";

// ============================================================================
// Flex Fields definitions
// ============================================================================

export const FlexContainerSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.flexContainer,
  title: "Flex container",
  description: "Controls how this element arranges its children.",
  fields: FLEX_CONTAINER_FIELDS,
};

export const FlexItemSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.flexItem,
  title: "Flex item",
  description: "Controls this element inside its flex parent.",
  fields: FLEX_ITEM_FIELDS,
};

// ============================================================================
// Grid Fields definitions
// ============================================================================

export const GridContainerSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.gridContainer,
  title: "Grid container",
  description: "Defines tracks and aligns this element's children.",
  fields: GRID_CONTAINER_FIELDS,
};

export const GridItemSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.gridItem,
  title: "Grid item",
  description: "Places and aligns this element in its grid parent.",
  fields: GRID_ITEM_FIELDS,
};

// ============================================================================
// General  definitions
// ============================================================================

export const LayoutModeSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.layoutMode,
  title: "Layout mode",
  description: "Controls box generation and positioning.",
  fields: DISPLAY_FIELDS,
};

export const WidthSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.sizeWidth,
  title: "Width",
  description: "Physical width and its minimum and maximum constraints.",
  fields: WIDTH_FIELDS,
};

export const HeightSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.sizeHeight,
  title: "Height",
  description: "Physical height and its minimum and maximum constraints.",
  fields: HEIGHT_FIELDS,
};

export const InlineSizeSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.sizeInline,
  title: "Inline size",
  description: "Logical inline dimension and its constraints.",
  fields: INLINE_SIZE_FIELDS,
};

export const BlockSizeSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.sizeBlock,
  title: "Block size",
  description: "Logical block dimension and its constraints.",
  fields: BLOCK_SIZE_FIELDS,
};

export const SizeBehaviorSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.sizeBehavior,
  title: "Size behavior",
  description: "Box sizing calculation and preferred aspect ratio.",
  fields: SIZE_BEHAVIOR_FIELDS,
};

export const MarginSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.spaceMargin,
  title: "Margin",
  description: "Outer spacing on every physical edge.",
  fields: MARGIN_FIELDS,
};

export const PaddingSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.spacePadding,
  title: "Padding",
  description: "Inner spacing on every physical edge.",
  fields: PADDING_FIELDS,
};

export const OverflowSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.boxOverflow,
  title: "Overflow & visibility",
  description: "Clipping, scrolling and visibility behavior.",
  fields: OVERFLOW_FIELDS,
};

export const PositioningSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.boxPosition,
  title: "Positioning",
  description: "Position mode, offsets and stacking.",
  fields: POSITIONING_FIELDS,
};

export const BoxModelSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.boxModel,
  title: "Layout & box model",
  description: "Size, spacing, positioning and overflow.",
  sections: {
    width: WidthSection,
    height: HeightSection,
    inline: InlineSizeSection,
    block: BlockSizeSection,
    sizeBehavior: SizeBehaviorSection,
    margin: MarginSection,
    padding: PaddingSection,
    positioning: PositioningSection,
    overflow: OverflowSection,
  },
};

export const FontSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.typographyFont,
  title: "Font",
  description: "Typeface, scale, weight and rhythm.",
  fields: FONT_FIELDS,
};

export const TextSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.typographyText,
  title: "Text",
  description: "Alignment, color, casing and wrapping.",
  fields: TEXT_FIELDS,
};

export const TypographySection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.typography,
  title: "Typography",
  description: "Controls font and text presentation.",
  sections: {
    font: FontSection,
    text: TextSection,
  },
};

export const FlowSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.layoutFlow,
  title: "Flow & containment",
  description: "Floats, replaced content and rendering containment.",
  fields: FLOW_FIELDS,
};

export const TransformSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.layoutTransform,
  title: "Transforms",
  description: "Translation, rotation, scaling and perspective.",
  fields: TRANSFORM_FIELDS,
};

export const InteractionSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.interaction,
  title: "Interaction",
  description: "Pointer, selection, touch and resizing behavior.",
  fields: INTERACTION_FIELDS,
};

export const BackgroundSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearanceBackground,
  title: "Background",
  description: "Color, image, position, sizing and painting.",
  fields: BACKGROUND_FIELDS,
};

export const BorderSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearanceBorder,
  title: "Border",
  description: "Width, style and color for each edge.",
  fields: BORDER_FIELDS,
};

const RadiusSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearanceRadius,
  title: "Corner radius",
  description:
    "Use one value for both axes or two values for an elliptical corner.",
  fields: BORDER_RADIUS_FIELDS,
};

export const EffectsSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearanceEffects,
  title: "Effects",
  description: "Shadow and transparency controls.",
  fields: EFFECTS_FIELDS,
};

export const OutlineSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearanceOutline,
  title: "Outline",
  description: "Focus rings and non-layout edge decoration.",
  fields: OUTLINE_FIELDS,
};

export const AppearanceSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.appearance,
  title: "Appearance",
  description: "Controls surfaces, borders, shadows and opacity.",
  sections: {
    background: BackgroundSection,
    border: BorderSection,
    radius: RadiusSection,
    effects: EffectsSection,
    outline: OutlineSection,
  },
};

export const GeneralSection: InspectorSectionDefinition = {
  id: INSPECTOR_FIELD_IDS.generalFields,
  title: "Behavior & interaction",
  description: "Flow, transforms and user interaction behavior.",
  sections: {
    flow: FlowSection,
    transform: TransformSection,
    interaction: InteractionSection,
  },
};

export const SECTIONS: Record<string, InspectorSectionDefinition[]> = {
  layoutMode: [LayoutModeSection],
  container: [],
  item: [],
  layoutAndBox: [BoxModelSection],
  typography: [TypographySection],
  appearance: [AppearanceSection],
  behavior: [GeneralSection],
};

function isFlex(kind: LayoutKind): boolean {
  return kind === "flex" || kind === "inline-flex";
}

function isGrid(kind: LayoutKind): boolean {
  return kind === "grid" || kind === "inline-grid";
}

export function getInspectorSections(
  layout: ElementLayoutInfo | null,
): InspectorSectionDefinition[] {
  const containerKind = layout?.containerKind ?? null;
  const parentKind = layout?.parentContainerKind ?? null;

  const sections: Record<string, InspectorSectionDefinition[]> = {
    ...SECTIONS,

    container:
      layout?.isContainer && isFlex(containerKind)
        ? [FlexContainerSection]
        : layout?.isContainer && isGrid(containerKind)
          ? [GridContainerSection]
          : [],

    item:
      layout?.isItem && isFlex(parentKind)
        ? [FlexItemSection]
        : layout?.isItem && isGrid(parentKind)
          ? [GridItemSection]
          : [],
  };

  return Object.values(sections).flat();
}
