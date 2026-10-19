import type { RegistryWidgetsType, RJSFSchema } from "@rjsf/utils";
import type { JSONSchema7TypeName } from "json-schema";

import { CssColorWidget } from "./schemas/CssColorWidget";
import { CssRangeWidget } from "./schemas/CssRangeWidget";
import { CssSelectWidget } from "./schemas/CssSelectWidget";

export const INSPECTOR_WIDGETS = {
  select: "CssSelectWidget",
  range: "CssRangeWidget",
  color: "CssColorWidget",
} as const;

export type InspectorWidgetId = keyof typeof INSPECTOR_WIDGETS;

export const inspectorWidgets: RegistryWidgetsType = {
  CssRangeWidget,
  CssSelectWidget,
  CssColorWidget,
};

export const INSPECTOR_FIELD_IDS = {
  layoutMode: "layoutMode",

  flexContainer: "flexContainer",
  flexItem: "flexItem",
  gridContainer: "gridContainer",
  gridItem: "gridItem",

  generalFields: "generalFields",

  boxModel: "boxModel",
  typography: "typography",
  appearance: "appearance",

  appearanceBackground: "appearanceBackground",
  appearanceBorder: "appearanceBorder",
  appearanceEffects: "appearanceEffects",
  appearanceOutline: "appearanceOutline",

  boxPosition: "boxPosition",
  boxOverflow: "boxOverflow",

  typographyFont: "typographyFont",
  typographyText: "typographyText",

  layoutFlow: "layoutFlow",
  layoutTransform: "layoutTransform",

  interaction: "interaction",

  sizeWidth: "sizeWidth",
  sizeHeight: "sizeHeight",
  sizeInline: "sizeInline",
  sizeBlock: "sizeBlock",
  sizeBehavior: "sizeBehavior",

  spaceMargin: "spaceMargin",
  spacePadding: "spacePadding",
} as const;

export type InspectorFieldId =
  (typeof INSPECTOR_FIELD_IDS)[keyof typeof INSPECTOR_FIELD_IDS];

export type InspectorFieldDefinition = {
  property: string;
  title: string;
  description: string;
  widgetId?: InspectorWidgetId;
  type?: JSONSchema7TypeName;
  enum?: string[];
};

export type InspectorSectionDefinition = {
  id: InspectorFieldId;
  title: string;
  description: string;
  fields?: readonly InspectorFieldDefinition[];
  sections?: Readonly<Record<string, InspectorSectionDefinition>>;
};

export type InspectorFieldEntry = {
  path: string[];
  property: string;
};

export type InspectorSectionSchema = RJSFSchema & {
  $id: string;
};

export type InspectorFormData = Record<string, unknown>;

export function createSectionSchema(
  section: InspectorSectionDefinition,
): InspectorSectionSchema {
  const properties = section.fields
    ? Object.fromEntries(
        section.fields.map((field) => [
          field.property,
          {
            type: field.type ?? "string",
            title: field.title,
            description: field.description,
            ...(field.enum ? { enum: field.enum } : {}),
          },
        ]),
      )
    : Object.fromEntries(
        Object.entries(section.sections ?? {}).map(([property, child]) => [
          property,
          createSectionSchema(child),
        ]),
      );

  return {
    $id: section.id,
    type: "object",
    title: section.title,
    description: section.description,
    additionalProperties: false,
    properties,
  };
}
