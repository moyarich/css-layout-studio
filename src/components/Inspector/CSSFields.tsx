import {
  INSPECTOR_FIELD_IDS,
  type InspectorFieldDefinition,
  type InspectorSectionDefinition,
} from "./inspector-model";

// ============================================================================
// Layout mode
// ============================================================================
export const DISPLAY_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "display",
    title: "Display",
    description: "Defines the element's outer and inner layout behavior.",
    widgetId: "select",
    enum: [
      "block",
      "inline",
      "inline-block",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "contents",
      "none",
    ],
  },
];

// ============================================================================
// Flex Fields
// ============================================================================
export const FLEX_CONTAINER_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "flex-direction",
    title: "Direction",
    description: "Sets the main axis and direction of flex items.",
    widgetId: "select",
    enum: ["row", "column", "row-reverse", "column-reverse"],
  },
  {
    property: "flex-wrap",
    title: "Wrap",
    description: "Controls whether flex items wrap onto additional lines.",
    widgetId: "select",
    enum: ["nowrap", "wrap", "wrap-reverse"],
  },
  {
    property: "justify-content",
    title: "Justify content",
    description: "Distributes items along the container's main axis.",
    widgetId: "select",
    enum: [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
      "space-evenly",
    ],
  },
  {
    property: "align-items",
    title: "Align items",
    description: "Aligns items along the container's cross axis.",
    widgetId: "select",
    enum: ["stretch", "flex-start", "center", "flex-end", "baseline"],
  },
  {
    property: "align-content",
    title: "Align content",
    description: "Distributes wrapped flex lines along the cross axis.",
    widgetId: "select",
    enum: [
      "normal",
      "stretch",
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
      "space-evenly",
    ],
  },
  {
    property: "gap",
    title: "Gap",
    description: "Sets the space between flex items.",
    widgetId: "range",
  },
  {
    property: "row-gap",
    title: "Row gap",
    description: "Sets spacing between flex rows.",
    widgetId: "range",
  },
  {
    property: "column-gap",
    title: "Column gap",
    description: "Sets spacing between flex columns.",
    widgetId: "range",
  },
];

export const FLEX_ITEM_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "order",
    title: "Order",
    description: "Changes this item's visual order among its siblings.",
    widgetId: "range",
  },
  {
    property: "flex-grow",
    title: "Grow",
    description: "Controls how much available space this item may gain.",
    widgetId: "range",
  },
  {
    property: "flex-shrink",
    title: "Shrink",
    description: "Controls how much this item may shrink when space is tight.",
    widgetId: "range",
  },
  {
    property: "flex-basis",
    title: "Basis",
    description: "Sets this item's initial main-axis size.",
  },
  {
    property: "align-self",
    title: "Align self",
    description:
      "Overrides the container's cross-axis alignment for this item.",
    widgetId: "select",
    enum: ["auto", "stretch", "flex-start", "center", "flex-end", "baseline"],
  },
  {
    property: "min-width",
    title: "Minimum width",
    description: "Sets the minimum inline size this flex item may shrink to.",
  },
  {
    property: "min-height",
    title: "Minimum height",
    description: "Sets the minimum block size this flex item may shrink to.",
  },
];

// ============================================================================
// Grid Fields
// ============================================================================
export const GRID_CONTAINER_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "grid-template-columns",
    title: "Template columns",
    description: "Defines the explicit grid column tracks.",
  },
  {
    property: "grid-template-rows",
    title: "Template rows",
    description: "Defines the explicit grid row tracks.",
  },
  {
    property: "grid-template-areas",
    title: "Template areas",
    description: "Defines named grid areas for declarative placement.",
  },
  {
    property: "grid-auto-flow",
    title: "Auto flow",
    description: "Controls how auto-placed items fill the grid.",
    widgetId: "select",
    enum: ["row", "column", "dense", "row dense", "column dense"],
  },
  {
    property: "grid-auto-columns",
    title: "Auto columns",
    description: "Sets the size of automatically created columns.",
  },
  {
    property: "grid-auto-rows",
    title: "Auto rows",
    description: "Sets the size of automatically created rows.",
  },
  {
    property: "justify-items",
    title: "Justify items",
    description: "Aligns grid items within their cells on the inline axis.",
    widgetId: "select",
    enum: ["stretch", "start", "center", "end"],
  },
  {
    property: "align-items",
    title: "Align items",
    description: "Aligns grid items within their cells on the block axis.",
    widgetId: "select",
    enum: ["stretch", "start", "center", "end", "baseline"],
  },
  {
    property: "justify-content",
    title: "Justify content",
    description: "Distributes grid tracks along the inline axis.",
    widgetId: "select",
    enum: [
      "normal",
      "start",
      "center",
      "end",
      "space-between",
      "space-around",
      "space-evenly",
    ],
  },
  {
    property: "align-content",
    title: "Align content",
    description: "Distributes grid tracks along the block axis.",
    widgetId: "select",
    enum: [
      "normal",
      "start",
      "center",
      "end",
      "space-between",
      "space-around",
      "space-evenly",
      "stretch",
    ],
  },
  {
    property: "gap",
    title: "Gap",
    description: "Sets the space between grid rows and columns.",
    widgetId: "range",
  },
  {
    property: "row-gap",
    title: "Row gap",
    description: "Sets spacing between grid rows.",
    widgetId: "range",
  },
  {
    property: "column-gap",
    title: "Column gap",
    description: "Sets spacing between grid columns.",
    widgetId: "range",
  },
];

export const GRID_ITEM_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "grid-column",
    title: "Column",
    description: "Sets this item's grid-column start and end lines.",
  },
  {
    property: "grid-row",
    title: "Row",
    description: "Sets this item's grid-row start and end lines.",
  },
  {
    property: "grid-area",
    title: "Area",
    description: "Places this item in a named area or between grid lines.",
  },
  {
    property: "grid-column-start",
    title: "Column start",
    description: "Sets the starting grid column line.",
  },
  {
    property: "grid-column-end",
    title: "Column end",
    description: "Sets the ending grid column line.",
  },
  {
    property: "grid-row-start",
    title: "Row start",
    description: "Sets the starting grid row line.",
  },
  {
    property: "grid-row-end",
    title: "Row end",
    description: "Sets the ending grid row line.",
  },
  {
    property: "justify-self",
    title: "Justify self",
    description: "Overrides inline-axis alignment for this grid item.",
    widgetId: "select",
    enum: ["auto", "stretch", "start", "center", "end"],
  },
  {
    property: "align-self",
    title: "Align self",
    description: "Overrides block-axis alignment for this grid item.",
    widgetId: "select",
    enum: ["auto", "stretch", "start", "center", "end", "baseline"],
  },
];

// ============================================================================
// Sizing
// ============================================================================

export const WIDTH_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "min-width",
    title: "Min width",
    description: "Sets the element's minimum width.",
  },
  {
    property: "width",
    title: "Width",
    description: "Sets the element's preferred width.",
  },
  {
    property: "max-width",
    title: "Max width",
    description: "Sets the element's maximum width.",
  },
];

export const HEIGHT_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "min-height",
    title: "Min height",
    description: "Sets the element's minimum height.",
  },
  {
    property: "height",
    title: "Height",
    description: "Sets the element's preferred height.",
  },
  {
    property: "max-height",
    title: "Max height",
    description: "Sets the element's maximum height.",
  },
];

export const INLINE_SIZE_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "min-inline-size",
    title: "Min inline size",
    description: "Sets the minimum logical inline dimension.",
  },
  {
    property: "inline-size",
    title: "Inline size",
    description: "Sets the logical inline dimension of the element.",
  },
  {
    property: "max-inline-size",
    title: "Max inline size",
    description: "Sets the maximum logical inline dimension.",
  },
];

export const BLOCK_SIZE_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "min-block-size",
    title: "Min block size",
    description: "Sets the minimum logical block dimension.",
  },
  {
    property: "block-size",
    title: "Block size",
    description: "Sets the logical block dimension of the element.",
  },
  {
    property: "max-block-size",
    title: "Max block size",
    description: "Sets the maximum logical block dimension.",
  },
];

export const SIZE_BEHAVIOR_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "box-sizing",
    title: "Box sizing",
    description:
      "Controls whether border and padding are included in the declared size.",
    widgetId: "select",
    enum: ["content-box", "border-box"],
  },
  {
    property: "aspect-ratio",
    title: "Aspect ratio",
    description: "Sets a preferred width-to-height ratio for the box.",
  },
];

// ============================================================================
// Spacing
// ============================================================================

export const MARGIN_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "margin",
    title: "Margin",
    description: "Sets the outer spacing around the element.",
  },
  {
    property: "margin-top",
    title: "Margin top",
    description: "Sets the outer spacing above the element.",
  },
  {
    property: "margin-right",
    title: "Margin right",
    description: "Sets the outer spacing to the right of the element.",
  },
  {
    property: "margin-bottom",
    title: "Margin bottom",
    description: "Sets the outer spacing below the element.",
  },
  {
    property: "margin-left",
    title: "Margin left",
    description: "Sets the outer spacing to the left of the element.",
  },
];

export const PADDING_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "padding",
    title: "Padding",
    description: "Sets the inner spacing for the content.",
  },
  {
    property: "padding-top",
    title: "Padding top",
    description: "Sets the inner spacing above the content.",
  },
  {
    property: "padding-right",
    title: "Padding right",
    description: "Sets the inner spacing to the right of the content.",
  },
  {
    property: "padding-bottom",
    title: "Padding bottom",
    description: "Sets the inner spacing below the content.",
  },
  {
    property: "padding-left",
    title: "Padding left",
    description: "Sets the inner spacing to the left of the content.",
  },
];

// ============================================================================
// Positioning / overflow
// ============================================================================

export const POSITIONING_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "position",
    title: "Position",
    description: "Chooses how the element is positioned in the document.",
    widgetId: "select",
    enum: ["static", "relative", "absolute", "fixed", "sticky"],
  },
  {
    property: "top",
    title: "Top",
    description: "Offsets a positioned element from its top reference edge.",
  },
  {
    property: "right",
    title: "Right",
    description: "Offsets a positioned element from its right reference edge.",
  },
  {
    property: "bottom",
    title: "Bottom",
    description: "Offsets a positioned element from its bottom reference edge.",
  },
  {
    property: "left",
    title: "Left",
    description: "Offsets a positioned element from its left reference edge.",
  },
  {
    property: "z-index",
    title: "Z index",
    description: "Controls the element's stacking order.",
  },
  {
    property: "inset-inline-start",
    title: "Inline start",
    description: "Sets the logical inline-start offset.",
  },
  {
    property: "inset-inline-end",
    title: "Inline end",
    description: "Sets the logical inline-end offset.",
  },
  {
    property: "inset-block-start",
    title: "Block start",
    description: "Sets the logical block-start offset.",
  },
  {
    property: "inset-block-end",
    title: "Block end",
    description: "Sets the logical block-end offset.",
  },
];

export const OVERFLOW_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "overflow",
    title: "Overflow",
    description: "Controls how content outside the element's box is handled.",
    widgetId: "select",
    enum: ["visible", "hidden", "clip", "scroll", "auto"],
  },
  {
    property: "overflow-x",
    title: "Overflow X",
    description: "Controls horizontal overflow behavior.",
    widgetId: "select",
    enum: ["visible", "hidden", "clip", "scroll", "auto"],
  },
  {
    property: "overflow-y",
    title: "Overflow Y",
    description: "Controls vertical overflow behavior.",
    widgetId: "select",
    enum: ["visible", "hidden", "clip", "scroll", "auto"],
  },
  {
    property: "visibility",
    title: "Visibility",
    description: "Shows or hides the box while preserving its layout space.",
    widgetId: "select",
    enum: ["visible", "hidden", "collapse"],
  },
];

// ============================================================================
// Typography
// ============================================================================

export const TYPOGRAPHY_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "font-size",
    title: "Font size",
    description: "Sets the size of the element's text.",
  },
  {
    property: "font-weight",
    title: "Font weight",
    description: "Sets the thickness of the element's text.",
  },
  {
    property: "line-height",
    title: "Line height",
    description: "Sets the height of each line of text.",
  },
  {
    property: "text-align",
    title: "Text align",
    description: "Controls the horizontal alignment of inline content.",
    widgetId: "select",
    enum: ["start", "left", "center", "right", "end", "justify"],
  },
  {
    property: "color",
    title: "Color",
    description: "Sets the foreground color, including text and decorations.",
    widgetId: "color",
  },
];

export const FONT_FIELDS: InspectorFieldDefinition[] = [
  ...TYPOGRAPHY_FIELDS.filter((field) =>
    ["font-size", "font-weight", "line-height"].includes(field.property),
  ),
  {
    property: "font-family",
    title: "Font family",
    description: "Sets the prioritized list of fonts used for text.",
  },
  {
    property: "font-style",
    title: "Font style",
    description: "Selects normal, italic, or oblique text.",
    widgetId: "select",
    enum: ["normal", "italic", "oblique"],
  },
  {
    property: "letter-spacing",
    title: "Letter spacing",
    description: "Adjusts the space between text characters.",
  },
];

export const TEXT_FIELDS: InspectorFieldDefinition[] = [
  ...TYPOGRAPHY_FIELDS.filter((field) =>
    ["text-align", "color"].includes(field.property),
  ),
  {
    property: "text-transform",
    title: "Text transform",
    description: "Controls capitalization of text.",
    widgetId: "select",
    enum: ["none", "capitalize", "uppercase", "lowercase"],
  },
  {
    property: "text-decoration",
    title: "Text decoration",
    description: "Sets decorative lines and their styling.",
  },
  {
    property: "white-space",
    title: "White space",
    description: "Controls collapsing and wrapping of whitespace.",
    widgetId: "select",
    enum: ["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"],
  },
  {
    property: "word-break",
    title: "Word break",
    description: "Controls where text may break within words.",
    widgetId: "select",
    enum: ["normal", "break-all", "keep-all", "break-word"],
  },
  {
    property: "overflow-wrap",
    title: "Overflow wrap",
    description: "Allows long words to wrap to prevent overflow.",
    widgetId: "select",
    enum: ["normal", "break-word", "anywhere"],
  },
  {
    property: "text-overflow",
    title: "Text overflow",
    description: "Controls how clipped inline text is represented.",
    widgetId: "select",
    enum: ["clip", "ellipsis"],
  },
  {
    property: "text-indent",
    title: "Text indent",
    description: "Sets indentation of the first line of text.",
  },
  {
    property: "vertical-align",
    title: "Vertical align",
    description: "Aligns inline-level and table-cell boxes vertically.",
  },
  {
    property: "hyphens",
    title: "Hyphens",
    description: "Controls automatic word hyphenation.",
    widgetId: "select",
    enum: ["none", "manual", "auto"],
  },
];

// ============================================================================
// Flow / transforms / interaction
// ============================================================================

export const FLOW_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "float",
    title: "Float",
    description:
      "Places the element to one side and allows inline content to wrap around it.",
    widgetId: "select",
    enum: ["none", "left", "right", "inline-start", "inline-end"],
  },
  {
    property: "clear",
    title: "Clear",
    description:
      "Controls whether the element must move below floated elements.",
    widgetId: "select",
    enum: ["none", "left", "right", "both", "inline-start", "inline-end"],
  },
  {
    property: "contain",
    title: "Contain",
    description:
      "Limits layout, paint, size, or style effects to this subtree.",
  },
  {
    property: "content-visibility",
    title: "Content visibility",
    description: "Controls whether rendering work may be skipped.",
    widgetId: "select",
    enum: ["visible", "auto", "hidden"],
  },
  {
    property: "object-fit",
    title: "Object fit",
    description: "Controls how replaced content fits its box.",
    widgetId: "select",
    enum: ["fill", "contain", "cover", "none", "scale-down"],
  },
  {
    property: "object-position",
    title: "Object position",
    description: "Positions replaced content within its box.",
  },
];

export const TRANSFORM_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "transform",
    title: "Transform",
    description: "Applies a list of 2D or 3D transform functions.",
  },
  {
    property: "transform-origin",
    title: "Transform origin",
    description: "Sets the origin around which transforms operate.",
  },
  {
    property: "translate",
    title: "Translate",
    description: "Moves the element independently of the transform shorthand.",
  },
  {
    property: "rotate",
    title: "Rotate",
    description:
      "Rotates the element independently of the transform shorthand.",
  },
  {
    property: "scale",
    title: "Scale",
    description: "Scales the element independently of the transform shorthand.",
  },
  {
    property: "perspective",
    title: "Perspective",
    description: "Sets viewing distance for positioned 3D descendants.",
  },
];

export const INTERACTION_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "cursor",
    title: "Cursor",
    description: "Sets the pointer cursor shown over the element.",
  },
  {
    property: "pointer-events",
    title: "Pointer events",
    description: "Controls whether the element can receive pointer events.",
    widgetId: "select",
    enum: ["auto", "none"],
  },
  {
    property: "user-select",
    title: "User select",
    description: "Controls whether the user can select text.",
    widgetId: "select",
    enum: ["auto", "none", "text", "all"],
  },
  {
    property: "touch-action",
    title: "Touch action",
    description: "Controls browser handling of touch gestures.",
  },
  {
    property: "resize",
    title: "Resize",
    description: "Controls whether and how the user can resize the element.",
    widgetId: "select",
    enum: ["none", "both", "horizontal", "vertical", "block", "inline"],
  },
];

// ============================================================================
// Appearance
// ============================================================================

export const BACKGROUND_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "background-color",
    title: "Background color",
    description: "Sets the background color behind all background layers.",
    widgetId: "color",
  },
  {
    property: "background-image",
    title: "Background image",
    description: "Sets one or more background images or gradients.",
  },
  {
    property: "background-position-x",
    title: "Background X",
    description: "Sets the horizontal position of background layers.",
  },
  {
    property: "background-position-y",
    title: "Background Y",
    description: "Sets the vertical position of background layers.",
  },
  {
    property: "background-size",
    title: "Background size",
    description: "Sets the rendered size of background layers.",
  },
  {
    property: "background-repeat",
    title: "Background repeat",
    description: "Controls how background layers repeat.",
  },
  {
    property: "background-attachment",
    title: "Background attachment",
    description: "Controls whether backgrounds scroll with the element.",
  },
  {
    property: "background-origin",
    title: "Background origin",
    description: "Sets the box used to position background layers.",
  },
  {
    property: "background-clip",
    title: "Background clip",
    description: "Sets the box through which backgrounds are painted.",
  },
];

export const BORDER_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "border-top-width",
    title: "Top border width",
    description: "Sets the width of the top border.",
    widgetId: "range",
  },
  {
    property: "border-top-style",
    title: "Top border style",
    description: "Sets the line style of the top border.",
  },
  {
    property: "border-top-color",
    title: "Top border color",
    description: "Sets the color of the top border.",
    widgetId: "color",
  },
  {
    property: "border-right-width",
    title: "Right border width",
    description: "Sets the width of the right border.",
    widgetId: "range",
  },
  {
    property: "border-right-style",
    title: "Right border style",
    description: "Sets the line style of the right border.",
  },
  {
    property: "border-right-color",
    title: "Right border color",
    description: "Sets the color of the right border.",
    widgetId: "color",
  },
  {
    property: "border-bottom-width",
    title: "Bottom border width",
    description: "Sets the width of the bottom border.",
    widgetId: "range",
  },
  {
    property: "border-bottom-style",
    title: "Bottom border style",
    description: "Sets the line style of the bottom border.",
  },
  {
    property: "border-bottom-color",
    title: "Bottom border color",
    description: "Sets the color of the bottom border.",
    widgetId: "color",
  },
  {
    property: "border-left-width",
    title: "Left border width",
    description: "Sets the width of the left border.",
    widgetId: "range",
  },
  {
    property: "border-left-style",
    title: "Left border style",
    description: "Sets the line style of the left border.",
  },
  {
    property: "border-left-color",
    title: "Left border color",
    description: "Sets the color of the left border.",
    widgetId: "color",
  },
];

export const BORDER_RADIUS_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "border-top-left-radius",
    title: "Top-left radius",
    description: "Rounds the top-left corner of the border box.",
  },
  {
    property: "border-top-right-radius",
    title: "Top-right radius",
    description: "Rounds the top-right corner of the border box.",
  },
  {
    property: "border-bottom-right-radius",
    title: "Bottom-right radius",
    description: "Rounds the bottom-right corner of the border box.",
  },
  {
    property: "border-bottom-left-radius",
    title: "Bottom-left radius",
    description: "Rounds the bottom-left corner of the border box.",
  },
];

export const EFFECTS_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "clip-path",
    title: "Clip path",
    description:
      "Clips the element to an inset, circle, ellipse, polygon, path, or URL shape.",
  },
  {
    property: "box-shadow",
    title: "Shadow",
    description: "Adds one or more shadows around the element's box.",
  },
  {
    property: "opacity",
    title: "Opacity",
    description: "Sets the transparency of the entire element.",
    widgetId: "range",
  },
  {
    property: "filter",
    title: "Filter",
    description: "Applies graphical effects such as blur or contrast.",
  },
  {
    property: "backdrop-filter",
    title: "Backdrop filter",
    description: "Applies graphical effects to content behind the element.",
  },
  {
    property: "mix-blend-mode",
    title: "Blend mode",
    description: "Controls how the element blends with its backdrop.",
  },
  {
    property: "isolation",
    title: "Isolation",
    description: "Controls creation of a new stacking context.",
    widgetId: "select",
    enum: ["auto", "isolate"],
  },
];

export const OUTLINE_FIELDS: InspectorFieldDefinition[] = [
  {
    property: "outline-width",
    title: "Outline width",
    description: "Sets the width of the element's outline.",
  },
  {
    property: "outline-style",
    title: "Outline style",
    description: "Sets the line style of the element's outline.",
  },
  {
    property: "outline-color",
    title: "Outline color",
    description: "Sets the color of the element's outline.",
    widgetId: "color",
  },
  {
    property: "outline-offset",
    title: "Outline offset",
    description: "Sets the distance between outline and border edge.",
  },
];
