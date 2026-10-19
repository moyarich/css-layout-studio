import type { UiSchema, RJSFSchema } from "@rjsf/utils";

import type { ExpandedDeclaration } from "../../editor/css";
import type { ComputedSnapshot } from "../../editor/types";

import {
  InspectorFieldDefinition,
  INSPECTOR_WIDGETS,
  InspectorSectionDefinition,
  createSectionSchema,
  InspectorFieldEntry,
  InspectorFormData,
} from "./inspector-model";

export type InspectorFieldVisibilityRule = {
  section: string | "*";
  field?: string;
  hidden: boolean;
};

export const INITIALLY_OPEN_GROUPS = new Set([
  "layoutMode",
  "flexContainer",
  "flexItem",
  "gridContainer",
  "gridItem",
  "boxModel",
  "typography",
  "appearance",
  "generalFields",
  "sizeWidth",
  "sizeHeight",
]);

function getRangeOptions(property: string): Record<string, unknown> | null {
  if (
    property === "gap" ||
    property === "row-gap" ||
    property === "column-gap"
  ) {
    return {
      rangeMin: 0,
      rangeMax: 96,
      rangeStep: 1,
      rangeUnit: "px",
      rangeUnits: ["px", "rem", "em", "%"],
    };
  }

  if (property.startsWith("margin-")) {
    return {
      rangeMin: -256,
      rangeMax: 256,
      rangeStep: 1,
      rangeUnit: "px",
      rangeUnits: ["px", "rem", "em", "%", "vw", "vh"],
    };
  }

  if (property.startsWith("padding-")) {
    return {
      rangeMin: 0,
      rangeMax: 256,
      rangeStep: 1,
      rangeUnit: "px",
      rangeUnits: ["px", "rem", "em", "%", "vw", "vh"],
    };
  }

  if (
    /^(min-|max-)?(width|height)$/.test(property) ||
    /^(min-|max-)?(inline-size|block-size)$/.test(property)
  ) {
    return {
      rangeMin: 0,
      rangeMax: 1200,
      rangeStep: 1,
      rangeUnit: "px",
      rangeUnits: ["px", "rem", "em", "%", "vw", "vh"],
    };
  }

  if (property === "opacity") {
    return {
      rangeMin: 0,
      rangeMax: 1,
      rangeStep: 0.01,
      rangeUnit: "",
      rangeUnits: [""],
    };
  }

  if (property === "flex-grow" || property === "flex-shrink") {
    return {
      rangeMin: 0,
      rangeMax: 10,
      rangeStep: 0.1,
      rangeUnit: "",
      rangeUnits: [""],
    };
  }

  if (property === "order" || property === "z-index") {
    return {
      rangeMin: -100,
      rangeMax: 100,
      rangeStep: 1,
      rangeUnit: "",
      rangeUnits: [""],
    };
  }

  return null;
}

function getRjsfWidget(field: InspectorFieldDefinition): string | undefined {
  if (!field.widgetId) return undefined;

  return INSPECTOR_WIDGETS[field.widgetId];
}

function createFieldUiSchema(
  field: InspectorFieldDefinition,
  computed: ComputedSnapshot,
  declarations: Record<string, ExpandedDeclaration>,
): UiSchema {
  const property = field.property;
  const declaration = declarations[property];
  const rangeOptions = getRangeOptions(property);
  const usesRangeWidget = field.widgetId === "range" || rangeOptions !== null;
  const effectiveWidgetId = usesRangeWidget ? "range" : field.widgetId;
  const widget = usesRangeWidget
    ? INSPECTOR_WIDGETS.range
    : getRjsfWidget(field);

  return {
    "ui:placeholder": "Preset: unset",
    ...(widget ? { "ui:widget": widget } : {}),
    "ui:options": {
      cssProperty: property,
      computedValue: computed[property] ?? "—",
      ...(effectiveWidgetId ? { widgetId: effectiveWidgetId } : {}),
      ...(usesRangeWidget ? (rangeOptions ?? {}) : {}),
      ...(declaration
        ? {
            authoredValue: declaration.value,
            sourceProperty: declaration.sourceProperty,
            sourceValue: declaration.sourceValue,
            fromShorthand: declaration.fromShorthand,
            important: declaration.important,
          }
        : {}),
    },
  };
}

function createSectionUiSchema(
  section: InspectorSectionDefinition,
  computed: ComputedSnapshot,
  declarations: Record<string, ExpandedDeclaration>,
): UiSchema {
  // Custom fields are selected by the generated schema's $id.
  // uiSchema only owns widget and presentation metadata.
  const uiSchema: UiSchema = {};

  if (section.fields) {
    section.fields.forEach((field) => {
      uiSchema[field.property] = createFieldUiSchema(
        field,
        computed,
        declarations,
      );
    });
  }

  Object.entries(section.sections ?? {}).forEach(([property, child]) => {
    uiSchema[property] = createSectionUiSchema(child, computed, declarations);
  });

  return uiSchema;
}

export function createInspectorUiSchema(
  sections: InspectorSectionDefinition[],
  computed: ComputedSnapshot,
  declarations: Record<string, ExpandedDeclaration> = {},
): UiSchema {
  const uiSchema: UiSchema = {
    "ui:title": "",
    "ui:submitButtonOptions": {
      norender: true,
    },
    "ui:order": sections.map((section) => section.id),
  };

  sections.forEach((section) => {
    uiSchema[section.id] = createSectionUiSchema(
      section,
      computed,
      declarations,
    );
  });

  return uiSchema;
}

export function mergeInspectorSchemas(
  sections: InspectorSectionDefinition[],
): RJSFSchema {
  return {
    type: "object",
    additionalProperties: false,

    properties: Object.fromEntries(
      sections.map((section) => [section.id, createSectionSchema(section)]),
    ),
  };
}

export function createInspectorFormData(
  entries: InspectorFieldEntry[],
  declarations: Record<string, ExpandedDeclaration>,
): InspectorFormData {
  return entries.reduce((data, entry) => {
    const value = declarations[entry.property]?.value;

    if (value === undefined) {
      return data;
    }

    let target = data as Record<string, unknown>;

    entry.path.forEach((segment) => {
      target[segment] ??= {};
      target = target[segment] as Record<string, unknown>;
    });

    target[entry.property] = value;

    return data;
  }, {} as InspectorFormData);
}

export function fuzzyMatch(query: string, text: string): boolean {
  const haystack = text.toLocaleLowerCase();

  return query
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => {
      if (haystack.includes(term)) {
        return true;
      }

      let index = 0;

      for (const character of haystack) {
        if (character === term[index]) {
          index += 1;
        }

        if (index === term.length) {
          return true;
        }
      }

      return false;
    });
}

export function filterInspectorSections(
  sections: InspectorSectionDefinition[],
  query: string,
): InspectorSectionDefinition[] {
  if (!query.trim()) {
    return sections;
  }

  const visit = (
    section: InspectorSectionDefinition,
  ): InspectorSectionDefinition | null => {
    const sectionText = `${section.id} ${section.title} ${section.description}`;

    if (fuzzyMatch(query, sectionText)) {
      return section;
    }

    const fields = section.fields?.filter((field) => {
      const fieldText = `${field.property} ${field.title} ${field.description}`;

      return fuzzyMatch(query, fieldText);
    });

    const nestedSections = Object.fromEntries(
      Object.entries(section.sections ?? {}).flatMap(([property, child]) => {
        const filtered = visit(child);

        return filtered ? [[property, filtered]] : [];
      }),
    );

    const hasFields = Boolean(fields?.length);
    const hasSections = Object.keys(nestedSections).length > 0;

    if (!hasFields && !hasSections) {
      return null;
    }

    return {
      ...section,

      ...(section.fields
        ? {
            fields: fields ?? [],
          }
        : {}),

      ...(section.sections
        ? {
            sections: nestedSections,
          }
        : {}),
    };
  };

  return sections.flatMap((section) => {
    const filtered = visit(section);

    return filtered ? [filtered] : [];
  });
}

export function filterSectionsWithDeclarations(
  sections: InspectorSectionDefinition[],
  declarations: Record<string, ExpandedDeclaration>,
): InspectorSectionDefinition[] {
  const visit = (
    section: InspectorSectionDefinition,
  ): InspectorSectionDefinition | null => {
    const fields = section.fields?.filter(
      (field) => declarations[field.property] !== undefined,
    );

    const nestedSections = Object.fromEntries(
      Object.entries(section.sections ?? {}).flatMap(([property, child]) => {
        const filtered = visit(child);

        return filtered ? [[property, filtered]] : [];
      }),
    );

    const hasFields = Boolean(fields?.length);
    const hasSections = Object.keys(nestedSections).length > 0;

    if (!hasFields && !hasSections) {
      return null;
    }

    return {
      ...section,

      ...(section.fields
        ? {
            fields: fields ?? [],
          }
        : {}),

      ...(section.sections
        ? {
            sections: nestedSections,
          }
        : {}),
    };
  };

  return sections.flatMap((section) => {
    const filtered = visit(section);

    return filtered ? [filtered] : [];
  });
}

export function getInspectorGroupIds(
  sections: InspectorSectionDefinition[],
): string[] {
  const visit = (section: InspectorSectionDefinition): string[] => [
    section.id,

    ...Object.values(section.sections ?? {}).flatMap(visit),
  ];

  return sections.flatMap(visit);
}

export function getGroupsWithDeclarations(
  sections: InspectorSectionDefinition[],
  declarations: Record<string, ExpandedDeclaration>,
): string[] {
  const visit = (
    section: InspectorSectionDefinition,
  ): {
    hasData: boolean;
    ids: string[];
  } => {
    const hasOwnData =
      section.fields?.some(
        (field) => declarations[field.property] !== undefined,
      ) ?? false;

    const childResults = Object.values(section.sections ?? {}).map(visit);

    const hasChildData = childResults.some((result) => result.hasData);

    const hasData = hasOwnData || hasChildData;

    const descendantIds = childResults.flatMap((result) => result.ids);

    return {
      hasData,

      ids: hasData ? [section.id, ...descendantIds] : descendantIds,
    };
  };

  return sections.flatMap((section) => visit(section).ids);
}

export function getInspectorFormValue(
  data: InspectorFormData,
  path: string[],
  property: string,
): string {
  let target: unknown = data;

  for (const segment of path) {
    if (!target || typeof target !== "object") {
      return "";
    }

    target = (target as Record<string, unknown>)[segment];
  }

  return target && typeof target === "object"
    ? String((target as Record<string, unknown>)[property] ?? "")
    : "";
}

export function hasInspectorFormValue(
  data: InspectorFormData,
  path: string[],
  property: string,
): boolean {
  let target: unknown = data;

  for (const segment of path) {
    if (!target || typeof target !== "object") {
      return false;
    }

    target = (target as Record<string, unknown>)[segment];
  }

  return Boolean(
    target &&
    typeof target === "object" &&
    Object.prototype.hasOwnProperty.call(target, property),
  );
}

export function getInspectorProperties(
  sections: InspectorSectionDefinition[],
): string[] {
  const visit = (section: InspectorSectionDefinition): string[] => [
    ...(section.fields?.map((field) => field.property) ?? []),

    ...Object.values(section.sections ?? {}).flatMap(visit),
  ];

  return sections.flatMap(visit);
}

export function getInspectorFieldEntries(
  sections: InspectorSectionDefinition[],
): InspectorFieldEntry[] {
  const visit = (
    section: InspectorSectionDefinition,
    path: string[],
  ): InspectorFieldEntry[] => {
    const fields =
      section.fields?.map((field) => ({
        path,
        property: field.property,
      })) ?? [];

    const childFields = Object.entries(section.sections ?? {}).flatMap(
      ([property, child]) => visit(child, [...path, property]),
    );

    return [...fields, ...childFields];
  };

  return sections.flatMap((section) => visit(section, [section.id]));
}

export function applyInspectorFieldVisibility(
  sections: InspectorSectionDefinition[],
  rules: InspectorFieldVisibilityRule[] = [],
): InspectorSectionDefinition[] {
  const filterSection = (
    section: InspectorSectionDefinition,
    ancestorSections: string[] = [],
  ): InspectorSectionDefinition | null => {
    const sectionPath = [...ancestorSections, section.id];

    const sectionRule = rules
      .filter(
        (rule) =>
          !rule.field && (rule.section === "*" || rule.section === section.id),
      )
      .at(-1);

    if (sectionRule?.hidden) {
      return null;
    }

    const fields = section.fields?.filter((field) => {
      const hidden =
        rules
          .filter(
            (rule) =>
              (rule.section === "*" || sectionPath.includes(rule.section)) &&
              (!rule.field || rule.field === field.property),
          )
          .at(-1)?.hidden ?? false;

      return !hidden;
    });

    const nestedSections = Object.fromEntries(
      Object.entries(section.sections ?? {}).flatMap(([property, child]) => {
        const filtered = filterSection(child, sectionPath);

        return filtered ? [[property, filtered]] : [];
      }),
    );

    const hasFields = Boolean(fields?.length);

    const hasSections = Object.keys(nestedSections).length > 0;

    if (!hasFields && !hasSections) {
      return null;
    }

    return {
      ...section,

      ...(section.fields
        ? {
            fields: fields ?? [],
          }
        : {}),

      ...(section.sections
        ? {
            sections: nestedSections,
          }
        : {}),
    };
  };

  return sections.flatMap((section) => {
    const filtered = filterSection(section);

    return filtered ? [filtered] : [];
  });
}
