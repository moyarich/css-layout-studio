// cssRulesToRjsf.ts

import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import type {
  CssRule,
  LonghandDeclaration,
} from "../../../src/editor/declarations";

export type CssFieldProvenance = {
  property: string;
  selector: string;
  sourceProperty: string;
  sourceValue: string;
  fromShorthand: boolean;
  important: boolean;
};

export type CssRuleProvenance = {
  selector: string;
  fields: Record<string, CssFieldProvenance>;
};

export type CssFormProvenance = Record<string, CssRuleProvenance>;

export type CssFormData = Record<string, Record<string, string>>;

export type CssRjsfResult = {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: CssFormData;
  provenance: CssFormProvenance;
};

const ENUM_PROPERTIES: Record<string, string[]> = {
  display: [
    "block",
    "inline",
    "inline-block",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "none",
  ],

  "box-sizing": ["content-box", "border-box"],

  position: ["static", "relative", "absolute", "fixed", "sticky"],

  "flex-direction": ["row", "row-reverse", "column", "column-reverse"],

  "flex-wrap": ["nowrap", "wrap", "wrap-reverse"],

  "justify-content": [
    "normal",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "center",
    "left",
    "right",
    "space-between",
    "space-around",
    "space-evenly",
    "stretch",
  ],

  "align-items": [
    "normal",
    "stretch",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "center",
    "baseline",
  ],

  "align-content": [
    "normal",
    "stretch",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ],

  "align-self": [
    "auto",
    "normal",
    "stretch",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "center",
    "baseline",
  ],

  overflow: ["visible", "hidden", "clip", "scroll", "auto"],

  "overflow-x": ["visible", "hidden", "clip", "scroll", "auto"],

  "overflow-y": ["visible", "hidden", "clip", "scroll", "auto"],

  visibility: ["visible", "hidden", "collapse"],

  "text-align": ["start", "end", "left", "right", "center", "justify"],

  "white-space": [
    "normal",
    "nowrap",
    "pre",
    "pre-wrap",
    "pre-line",
    "break-spaces",
  ],
};

const COLOR_PROPERTIES = new Set([
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
]);

const LENGTH_PROPERTIES = new Set([
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",

  "top",
  "right",
  "bottom",
  "left",

  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",

  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",

  "row-gap",
  "column-gap",

  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",

  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",

  "font-size",
  "line-height",
]);

const FLEX_NUMBER_PROPERTIES = new Set(["flex-grow", "flex-shrink", "order"]);

function getFieldSchema(property: string): RJSFSchema {
  const enumValues = ENUM_PROPERTIES[property];

  if (enumValues) {
    return {
      type: "string",
      title: property,
      enum: enumValues,
    };
  }

  /*
   * Keep CSS values as strings.
   *
   * Even apparently numeric properties can legally
   * contain values such as:
   *
   * var(--grow)
   * calc(...)
   * inherit
   * revert
   */
  return {
    type: "string",
    title: property,
  };
}

function getFieldUiSchema(
  property: string,
  declaration: LonghandDeclaration,
): UiSchema {
  const uiSchema: UiSchema = {
    "ui:options": {
      cssProperty: property,

      sourceProperty: declaration.sourceProperty,

      sourceValue: declaration.sourceValue,

      fromShorthand: declaration.fromShorthand,

      important: declaration.important,
    },
  };

  if (declaration.fromShorthand) {
    uiSchema["ui:help"] =
      `From ${declaration.sourceProperty}: ${declaration.sourceValue}`;
  }

  if (ENUM_PROPERTIES[property]) {
    uiSchema["ui:widget"] = "select";

    return uiSchema;
  }

  if (COLOR_PROPERTIES.has(property)) {
    uiSchema["ui:widget"] = "CssColorWidget";

    return uiSchema;
  }

  if (LENGTH_PROPERTIES.has(property)) {
    uiSchema["ui:widget"] = "CssLengthWidget";

    return uiSchema;
  }

  if (FLEX_NUMBER_PROPERTIES.has(property)) {
    uiSchema["ui:widget"] = "CssNumberWidget";

    return uiSchema;
  }

  uiSchema["ui:widget"] = "text";

  return uiSchema;
}

export function cssRulesToRjsf(rules: CssRule[]): CssRjsfResult {
  const schema: RJSFSchema = {
    type: "object",
    title: "CSS",
    properties: {},
    additionalProperties: false,
  };

  const uiSchema: UiSchema = {
    "ui:submitButtonOptions": {
      norender: true,
    },
  };

  const formData: CssFormData = {};
  const provenance: CssFormProvenance = {};

  const order: string[] = [];

  rules.forEach((rule, ruleIndex) => {
    const ruleId = `rule_${ruleIndex}`;

    order.push(ruleId);

    const properties: Record<string, RJSFSchema> = {};

    const ruleUiSchema: UiSchema = {};
    const ruleFormData: Record<string, string> = {};

    const fields: Record<string, CssFieldProvenance> = {};

    const propertyOrder: string[] = [];

    for (const [property, declaration] of Object.entries(rule.longhands)) {
      propertyOrder.push(property);

      properties[property] = getFieldSchema(property);

      ruleUiSchema[property] = getFieldUiSchema(property, declaration);

      ruleFormData[property] = declaration.value;

      fields[property] = {
        property,
        selector: rule.selector,

        sourceProperty: declaration.sourceProperty,

        sourceValue: declaration.sourceValue,

        fromShorthand: declaration.fromShorthand,

        important: declaration.important,
      };
    }

    schema.properties![ruleId] = {
      type: "object",
      title: rule.selector,
      properties,
      additionalProperties: false,
    };

    ruleUiSchema["ui:order"] = propertyOrder;

    uiSchema[ruleId] = ruleUiSchema;

    formData[ruleId] = ruleFormData;

    provenance[ruleId] = {
      selector: rule.selector,
      fields,
    };
  });

  uiSchema["ui:order"] = order;

  return {
    schema,
    uiSchema,
    formData,
    provenance,
  };
}
