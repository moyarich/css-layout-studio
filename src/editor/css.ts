import * as csstree from "css-tree";
import type {
  Block,
  Declaration,
  DeclarationList,
  Rule,
  StyleSheet,
  Value,
} from "css-tree";
import { expand } from "b_short";

// #region Types

export type AuthoredDeclaration = {
  property: string;
  value: string;
  important: boolean;
};

export type LonghandDeclaration = {
  value: string;
  important: boolean;
  sourceProperty: string;
  sourceValue: string;
  fromShorthand: boolean;
};

export type ResolvedDeclaration<TSource = undefined> = LonghandDeclaration & {
  property: string;
  source?: TSource;
};

export type ExpandedDeclaration = ResolvedDeclaration<Rule> & {
  rule: Rule;
};

export type CssRule = {
  selector: string;
  authored: AuthoredDeclaration[];
  longhands: Record<string, LonghandDeclaration>;
};

export type MatchingRule = {
  rule: Rule;
  selector: string;
};

// #endregion

// #region Declaration Parsing

export function toAuthoredDeclaration(
  declaration: Declaration,
): AuthoredDeclaration {
  return {
    property: declaration.property,
    value: csstree.generate(declaration.value),
    important: declaration.important === true,
  };
}

export function parseDeclarationList(css: string): AuthoredDeclaration[] {
  const ast = csstree.parse(css, {
    context: "declarationList",
  }) as DeclarationList;

  const declarations: AuthoredDeclaration[] = [];

  ast.children.forEach((node) => {
    if (node.type !== "Declaration") {
      return;
    }

    declarations.push(toAuthoredDeclaration(node));
  });

  return declarations;
}

export function getAuthoredDeclarations(block: Block): AuthoredDeclaration[] {
  const declarations: AuthoredDeclaration[] = [];

  block.children.forEach((node) => {
    if (node.type !== "Declaration") {
      return;
    }

    declarations.push(toAuthoredDeclaration(node));
  });

  return declarations;
}

function parseDeclaration(
  property: string,
  value: string,
  important = false,
): Declaration {
  return csstree.parse(
    `${property}:${value}${important ? " !important" : ""}`,
    {
      context: "declaration",
    },
  ) as Declaration;
}

// #endregion

// #region b_short

/**
 * Expands a declaration through b_short.
 *
 * If b_short does not expand the property, the returned list
 * may contain the original shorthand itself.
 */
function expandWithBShort(
  property: string,
  value: string,
  important = false,
): AuthoredDeclaration[] | null {
  const expanded = expand(`${property}: ${value};`, {
    format: "css",
  });

  if (!expanded.ok || typeof expanded.result !== "string") {
    return null;
  }

  const declarations = parseDeclarationList(expanded.result).map(
    (declaration) => ({
      ...declaration,
      important,
    }),
  );

  return declarations.length ? declarations : null;
}

/**
 * Determines whether b_short actually expanded the property
 * into different properties.
 */
function getBShortLonghandsFromValue(
  shorthand: string,
  value: string,
): readonly string[] | null {
  const declarations = expandWithBShort(shorthand, value);

  if (!declarations) {
    return null;
  }

  const longhands = [
    ...new Set(
      declarations
        .map((declaration) => declaration.property)
        .filter((property) => property !== shorthand),
    ),
  ];

  return longhands.length ? longhands : null;
}

// #endregion

// #region Shorthand Families

/**
 * ShorthandFamily extends b_short rather than replacing it.
 *
 * By default:
 *
 * - expansion comes from b_short
 * - longhand discovery comes from b_short
 *
 * A family only needs to provide explicit `longhands` and
 * `expand` when b_short does not support that shorthand.
 *
 * `collapse` adds editor synchronization behavior that
 * b_short does not provide.
 */
export type ShorthandFamily = {
  /**
   * Explicit longhands.
   *
   * Normally omitted because they are discovered through
   * b_short.
   *
   * Required for unsupported shorthands such as gap.
   */
  longhands?: readonly string[];

  /**
   * Optional shorthand expansion override.
   *
   * Normally omitted because b_short performs expansion.
   */
  expand?: (value: string) => readonly string[] | null;

  /**
   * Converts resolved longhand values back into a shorthand.
   *
   * Used when synchronizing edits back to authored CSS.
   */
  collapse?: (values: readonly string[]) => string | null;
};

export type ShorthandFamilies = Record<string, ShorthandFamily>;

export type ResolvedShorthandFamily = {
  shorthand: string;
  longhands: readonly string[];
  definition: ShorthandFamily;
};

/**
 * Cache longhand discovery because a shorthand's longhand
 * property names do not change based on its value.
 */
const shorthandLonghandCache = new Map<string, readonly string[]>();

/**
 * CSS-wide keyword first because it is valid for every CSS
 * property.
 *
 * Additional values make discovery more tolerant if an
 * expander chooses not to expand CSS-wide keywords.
 */
const SHORTHAND_PROBE_VALUES = ["initial", "0", "1px"] as const;

/**
 * Discovers a shorthand's longhand property names by asking
 * b_short to expand it.
 *
 * Example:
 *
 * discoverBShortLonghands("padding")
 *
 * =>
 *
 * [
 *   "padding-top",
 *   "padding-right",
 *   "padding-bottom",
 *   "padding-left",
 * ]
 */
function discoverBShortLonghands(shorthand: string): readonly string[] | null {
  const cached = shorthandLonghandCache.get(shorthand);

  if (cached) {
    return cached;
  }

  for (const probeValue of SHORTHAND_PROBE_VALUES) {
    const longhands = getBShortLonghandsFromValue(shorthand, probeValue);

    if (!longhands) {
      continue;
    }

    shorthandLonghandCache.set(shorthand, longhands);

    return longhands;
  }

  return null;
}

/**
 * Returns the longhands for a family.
 *
 * Priority:
 *
 * 1. Explicit family.longhands
 * 2. b_short discovery
 */
export function getFamilyLonghands(
  shorthand: string,
  family: ShorthandFamily,
): readonly string[] | null {
  if (family.longhands && family.longhands.length) {
    return family.longhands;
  }

  return discoverBShortLonghands(shorthand);
}

/**
 * Parses:
 *
 * gap: 12px
 *
 * =>
 *
 * ["12px", "12px"]
 *
 *
 * gap: 8px 16px
 *
 * =>
 *
 * ["8px", "16px"]
 */
export function expandGapValue(
  value: string,
): readonly [string, string] | null {
  try {
    const valueAst = csstree.parse(value, {
      context: "value",
    }) as Value;

    const values = valueAst.children
      .toArray()
      .map((node) => csstree.generate(node));

    if (values.length === 1) {
      return [values[0], values[0]];
    }

    if (values.length === 2) {
      return [values[0], values[1]];
    }
  } catch {
    // Normal parse validation is handled by the caller.
  }

  return null;
}

function collapseGapValue(values: readonly string[]): string | null {
  if (values.length !== 2) {
    return null;
  }

  const [row, column] = values;

  return row === column ? row : `${row} ${column}`;
}

/**
 * Collapses a standard four-side shorthand.
 *
 * Input order:
 *
 * [
 *   top,
 *   right,
 *   bottom,
 *   left,
 * ]
 */
function collapseBoxValue(values: readonly string[]): string | null {
  if (values.length !== 4) {
    return null;
  }

  const [top, right, bottom, left] = values;

  if (top === right && top === bottom && top === left) {
    return top;
  }

  if (top === bottom && right === left) {
    return `${top} ${right}`;
  }

  if (right === left) {
    return `${top} ${right} ${bottom}`;
  }

  return `${top} ${right} ${bottom} ${left}`;
}

/**
 * SHORTHAND_FAMILY extends b_short.
 *
 * margin:
 *   expansion -> b_short
 *   longhands -> b_short
 *   collapse -> this module
 *
 * padding:
 *   expansion -> b_short
 *   longhands -> b_short
 *   collapse -> this module
 *
 * gap:
 *   expansion -> custom fallback
 *   longhands -> explicit fallback
 *   collapse -> this module
 */
export const SHORTHAND_FAMILY: ShorthandFamilies = {
  gap: {
    /*
     * b_short currently leaves gap untouched.
     *
     * This is the extension point.
     */
    longhands: ["row-gap", "column-gap"],

    expand: expandGapValue,

    collapse: collapseGapValue,
  },

  margin: {
    /*
     * No longhands.
     * No expand.
     *
     * b_short owns both.
     */
    collapse: collapseBoxValue,
  },

  padding: {
    /*
     * No longhands.
     * No expand.
     *
     * b_short owns both.
     */
    collapse: collapseBoxValue,
  },
};

/**
 * Resolves a family definition into its shorthand +
 * discovered/explicit longhands.
 */
function resolveShorthandFamily(
  shorthand: string,
  definition: ShorthandFamily,
): ResolvedShorthandFamily | null {
  const longhands = getFamilyLonghands(shorthand, definition);

  if (!longhands) {
    return null;
  }

  return {
    shorthand,
    longhands,
    definition,
  };
}

/**
 * Finds the shorthand family containing a property.
 *
 * Example:
 *
 * getShorthandFamily("padding")
 * getShorthandFamily("padding-top")
 *
 * both resolve to the padding family.
 */
export function getShorthandFamily(
  property: string,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): ResolvedShorthandFamily | undefined {
  /*
   * Fast path when the property itself is the shorthand.
   */
  const directDefinition = shorthandFamilies[property];

  if (directDefinition) {
    return resolveShorthandFamily(property, directDefinition) ?? undefined;
  }

  /*
   * Otherwise find which family's discovered longhands
   * contain the property.
   */
  for (const [shorthand, definition] of Object.entries(shorthandFamilies)) {
    const family = resolveShorthandFamily(shorthand, definition);

    if (!family) {
      continue;
    }

    if (family.longhands.includes(property)) {
      return family;
    }
  }

  return undefined;
}

function isFamilyProperty(
  family: ResolvedShorthandFamily,
  property: string,
): boolean {
  return property === family.shorthand || family.longhands.includes(property);
}

// #endregion

// #region Resolution

/**
 * Shared shorthand/longhand resolver used by:
 *
 * - editor
 * - inspector
 * - CssRules form
 *
 * b_short remains the default expander.
 *
 * SHORTHAND_FAMILY only overrides expansion when explicitly
 * configured.
 */
export function resolveDeclaration<TSource = undefined>(
  declaration: AuthoredDeclaration,
  source?: TSource,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): Record<string, ResolvedDeclaration<TSource>> {
  const { property, value, important } = declaration;

  const resolved = (
    item: AuthoredDeclaration,
  ): ResolvedDeclaration<TSource> => ({
    property: item.property,
    value: item.value,
    important: item.important,

    sourceProperty: property,
    sourceValue: value,

    fromShorthand: item.property !== property,

    ...(source === undefined
      ? {}
      : {
          source,
        }),
  });

  const fallback = () => ({
    [property]: resolved(declaration),
  });

  /*
   * Custom properties must never be expanded.
   */
  if (property.startsWith("--")) {
    return fallback();
  }

  /*
   * Only look up the family definition directly here.
   *
   * We only care about a custom expansion when the authored
   * property itself is the shorthand.
   */
  const familyDefinition = shorthandFamilies[property];

  if (familyDefinition?.expand) {
    const family = resolveShorthandFamily(property, familyDefinition);

    if (family) {
      const values = familyDefinition.expand(value);

      if (values && values.length === family.longhands.length) {
        return Object.fromEntries(
          family.longhands.map((longhand, index) => [
            longhand,

            resolved({
              property: longhand,

              value: values[index],

              important,
            }),
          ]),
        );
      }
    }

    /*
     * If a custom override cannot resolve this particular
     * value, continue into b_short rather than replacing its
     * behavior entirely.
     */
  }

  /*
   * Default path.
   *
   * margin, padding, border, flex, etc. remain owned by
   * b_short.
   */
  const declarations = expandWithBShort(property, value, important);

  if (!declarations) {
    return fallback();
  }

  /*
   * b_short may return the property unchanged when it cannot
   * expand the shorthand.
   *
   * That is still a valid resolved declaration.
   */
  return Object.fromEntries(
    declarations.map((item) => [item.property, resolved(item)]),
  );
}

/**
 * Resolves declarations in authored cascade order.
 *
 * Later declarations win except when an existing !important
 * declaration is followed by a non-important declaration.
 */
export function resolveDeclarations<TSource = undefined>(
  declarations: AuthoredDeclaration[],
  source?: TSource,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): Record<string, ResolvedDeclaration<TSource>> {
  const result: Record<string, ResolvedDeclaration<TSource>> = {};

  for (const declaration of declarations) {
    const expanded = resolveDeclaration(declaration, source, shorthandFamilies);

    for (const [property, candidate] of Object.entries(expanded)) {
      const current = result[property];

      if (!current) {
        result[property] = candidate;

        continue;
      }

      if (current.important && !candidate.important) {
        continue;
      }

      result[property] = candidate;
    }
  }

  return result;
}

export function expandAuthoredDeclaration(
  declaration: AuthoredDeclaration,
  rule: Rule,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): Record<string, ExpandedDeclaration> {
  return Object.fromEntries(
    Object.entries(
      resolveDeclaration(declaration, rule, shorthandFamilies),
    ).map(([property, item]) => [
      property,
      {
        ...item,
        rule,
      },
    ]),
  );
}

/**
 * Resolves a rule to effective declarations.
 *
 * Authored shorthands are also retained as editable inspector
 * properties.
 */
export function getExpandedRuleDeclarations(
  rule: Rule,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): Record<string, ExpandedDeclaration> {
  const authored = getAuthoredDeclarations(rule.block);

  const result = Object.fromEntries(
    Object.entries(resolveDeclarations(authored, rule, shorthandFamilies)).map(
      ([property, item]) => [
        property,
        {
          ...item,
          rule,
        },
      ],
    ),
  ) as Record<string, ExpandedDeclaration>;

  /*
   * Preserve authored shorthands.
   *
   * Example:
   *
   * padding: 24px
   *
   * resolved values include:
   *
   * padding-top
   * padding-right
   * padding-bottom
   * padding-left
   *
   * but we also keep:
   *
   * padding
   *
   * so the inspector can expose the authored shorthand.
   */
  authored.forEach((declaration) => {
    const expanded = resolveDeclaration(declaration, rule, shorthandFamilies);

    const expandsToOtherProperties = Object.keys(expanded).some(
      (property) => property !== declaration.property,
    );

    if (!expandsToOtherProperties) {
      return;
    }

    result[declaration.property] = {
      property: declaration.property,

      value: declaration.value,

      important: declaration.important,

      sourceProperty: declaration.property,

      sourceValue: declaration.value,

      fromShorthand: false,

      source: rule,
      rule,
    };
  });

  return result;
}

/**
 * Reconstructs effective shorthand values from resolved
 * longhands.
 *
 * This fixes cases such as:
 *
 * padding: 24px;
 * padding-top: 77px;
 * padding-right: 104px;
 * padding-bottom: 91px;
 * padding-left: 137px;
 *
 * Effective inspector value:
 *
 * padding: 77px 104px 91px 137px
 */
function synthesizeShorthands(
  result: Record<string, ExpandedDeclaration>,
  shorthandFamilies: ShorthandFamilies,
): void {
  for (const [shorthand, definition] of Object.entries(shorthandFamilies)) {
    if (!definition.collapse) {
      continue;
    }

    const family = resolveShorthandFamily(shorthand, definition);

    if (!family) {
      continue;
    }

    const declarations = family.longhands.map((property) => result[property]);

    /*
     * Every longhand must be known before a shorthand can be
     * represented accurately.
     */
    if (declarations.some((declaration) => !declaration)) {
      continue;
    }

    const longhands = declarations as ExpandedDeclaration[];

    /*
     * One shorthand cannot represent mixed !important states.
     */
    const important = longhands[0].important;

    if (
      !longhands.every((declaration) => declaration.important === important)
    ) {
      continue;
    }

    const shorthandValue = definition.collapse(
      longhands.map((declaration) => declaration.value),
    );

    if (shorthandValue === null) {
      continue;
    }

    const authoredShorthand = result[shorthand];

    const source = authoredShorthand ?? longhands[0];

    result[shorthand] = {
      ...source,

      property: shorthand,

      value: shorthandValue,

      important,

      sourceValue: shorthandValue,

      fromShorthand: false,

      rule: authoredShorthand?.rule ?? longhands[0].rule,
    };
  }
}

/**
 * Merges resolved declarations from matching rules and then
 * derives shorthand values from the final longhands.
 */
export function mergeExpandedDeclarations(
  rules: Rule[],
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): Record<string, ExpandedDeclaration> {
  const result: Record<string, ExpandedDeclaration> = {};

  for (const rule of rules) {
    const declarations = getExpandedRuleDeclarations(rule, shorthandFamilies);

    for (const [property, candidate] of Object.entries(declarations)) {
      const current = result[property];

      if (!current) {
        result[property] = candidate;

        continue;
      }

      if (current.important && !candidate.important) {
        continue;
      }

      result[property] = candidate;
    }
  }

  synthesizeShorthands(result, shorthandFamilies);

  return result;
}

// #endregion

// #region CSS Rules

export function getCssRules(
  css: string,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): CssRule[] {
  const ast = csstree.parse(css);

  const rules = new Map<string, CssRule>();

  csstree.walk(ast, {
    visit: "Rule",

    enter(node) {
      if (node.type !== "Rule" || node.prelude.type !== "SelectorList") {
        return;
      }

      const authored = getAuthoredDeclarations(node.block);

      node.prelude.children.forEach((selectorNode) => {
        const selector = csstree.generate(selectorNode);

        const rule = rules.get(selector) ?? {
          selector,
          authored: [],
          longhands: {},
        };

        rule.authored.push(...authored);

        const resolved = resolveDeclarations(
          authored,
          undefined,
          shorthandFamilies,
        );

        Object.entries(resolved).forEach(([property, item]) => {
          rule.longhands[property] = {
            value: item.value,

            important: item.important,

            sourceProperty: item.sourceProperty,

            sourceValue: item.sourceValue,

            fromShorthand: item.fromShorthand,
          };
        });

        rules.set(selector, rule);
      });
    },
  });

  return [...rules.values()];
}

// #endregion

// #region Stylesheet

export function parseCssSource(source: string): StyleSheet {
  const errors: string[] = [];

  const ast = csstree.parse(source, {
    context: "stylesheet",

    positions: true,

    onParseError(error) {
      errors.push(error.formattedMessage);
    },
  }) as StyleSheet;

  if (errors.length) {
    throw new Error(errors.join("\n\n"));
  }

  return ast;
}

export function generateCss(ast: StyleSheet): string {
  return csstree.generate(ast);
}

export function formatCss(ast: StyleSheet): string {
  /*
   * CSS Tree remains the serialization source of truth.
   */
  return generateCss(ast);
}

// #endregion

// #region Matching Rules

export function getMatchingRules(
  ast: StyleSheet,
  element: HTMLElement,
): MatchingRule[] {
  const rules: MatchingRule[] = [];

  csstree.walk(ast, function (this: any, node: any) {
    if (node.type !== "Rule" || this.atrule) {
      return;
    }

    const rule = node as Rule;

    if (!rule.prelude || rule.prelude.type === "Raw") {
      return;
    }

    const selector = csstree.generate(rule.prelude);

    try {
      if (element.matches(selector)) {
        rules.push({
          rule,
          selector,
        });
      }
    } catch {
      /*
       * Selectors unsupported by Element.matches are not
       * inspector-editable.
       */
    }
  });

  return rules;
}

// #endregion

// #region Declaration Reading

export function getDeclarationValue(
  rule: Rule | null,
  property: string,
): string | null {
  if (!rule) {
    return null;
  }

  let value: string | null = null;

  csstree.walk(rule.block, {
    visit: "Declaration",

    enter(node) {
      const declaration = node as Declaration;

      if (declaration.property === property) {
        value = csstree.generate(declaration.value);
      }
    },
  });

  return value;
}

function getLastAuthoredDeclaration(
  rule: Rule,
  property: string,
): AuthoredDeclaration | null {
  let result: AuthoredDeclaration | null = null;

  rule.block.children.forEach((node) => {
    if (node.type !== "Declaration") {
      return;
    }

    if (node.property !== property) {
      return;
    }

    result = toAuthoredDeclaration(node);
  });

  return result;
}

// #endregion

// #region Declaration Editing

/**
 * Determines what !important state can safely be used when a
 * family is rewritten as a shorthand.
 */
function getFamilyImportance(
  family: ResolvedShorthandFamily,
  existing: Record<string, ExpandedDeclaration>,
): boolean {
  const shorthand = existing[family.shorthand];

  if (shorthand) {
    return shorthand.important;
  }

  const longhands = family.longhands
    .map((property) => existing[property])
    .filter(
      (declaration): declaration is ExpandedDeclaration =>
        declaration !== undefined,
    );

  if (longhands.length !== family.longhands.length) {
    return false;
  }

  const important = longhands[0].important;

  return longhands.every((declaration) => declaration.important === important)
    ? important
    : false;
}

/**
 * Builds the authored declarations required after editing a
 * shorthand family member.
 *
 * The function attempts to preserve the author's existing
 * representation.
 *
 * Example:
 *
 * padding: 24px;
 *
 * edit:
 *
 * padding-top = 77px
 *
 * =>
 *
 * padding: 77px 24px 24px;
 *
 *
 * Rather than:
 *
 * padding: 24px;
 * padding-top: 77px;
 */
function getFamilyWriteDeclarations(
  rule: Rule,
  family: ResolvedShorthandFamily,
  property: string,
  value: string,
  existing: Record<string, ExpandedDeclaration>,
): Declaration[] {
  const { shorthand, longhands, definition } = family;

  const authored = getAuthoredDeclarations(rule.block);

  const authoredFamilyDeclarations = authored.filter((declaration) =>
    isFamilyProperty(family, declaration.property),
  );

  const hasExistingFamily = authoredFamilyDeclarations.length > 0;

  const hasAuthoredShorthand = authoredFamilyDeclarations.some(
    (declaration) => declaration.property === shorthand,
  );

  /*
   * Editing the shorthand itself.
   */
  if (property === shorthand) {
    let normalizedValue = value;

    /*
     * If this family defines a custom expansion, use it for
     * validation/normalization.
     *
     * Example: gap.
     */
    if (definition.expand) {
      const values = definition.expand(value);

      if (!values || values.length !== longhands.length) {
        throw new Error(`Invalid ${shorthand} value: ${value}`);
      }

      if (definition.collapse) {
        normalizedValue = definition.collapse(values) ?? value;
      }
    } else {
      /*
       * Let b_short validate/expand supported shorthands.
       */
      const expanded = expandWithBShort(shorthand, value);

      if (!expanded) {
        throw new Error(`Invalid ${shorthand} value: ${value}`);
      }

      /*
       * If collapse exists, normalize using b_short's own
       * expanded values.
       */
      if (definition.collapse) {
        const expandedByProperty = new Map(
          expanded.map((declaration) => [
            declaration.property,
            declaration.value,
          ]),
        );

        const values = longhands.map((longhand) =>
          expandedByProperty.get(longhand),
        );

        if (values.every((item): item is string => item !== undefined)) {
          normalizedValue = definition.collapse(values) ?? value;
        }
      }
    }

    return [
      parseDeclaration(
        shorthand,
        normalizedValue,
        getFamilyImportance(family, existing),
      ),
    ];
  }

  /*
   * No existing shorthand/longhands from this family.
   *
   * Preserve the user's explicit longhand instead of
   * manufacturing sibling properties.
   */
  if (!hasExistingFamily) {
    return [
      parseDeclaration(property, value, existing[property]?.important ?? false),
    ];
  }

  /*
   * Compute the effective longhand state after the edit.
   */
  const values = longhands.map((longhand) => {
    if (longhand === property) {
      return {
        property: longhand,

        value,

        important: existing[longhand]?.important ?? false,
      };
    }

    const declaration = existing[longhand];

    if (!declaration) {
      return null;
    }

    return {
      property: longhand,

      value: declaration.value,

      important: declaration.important,
    };
  });

  /*
   * If the source was authored as a shorthand, keep it as a
   * shorthand whenever the final effective values can be
   * represented safely.
   */
  if (
    hasAuthoredShorthand &&
    definition.collapse &&
    values.every((item): item is NonNullable<typeof item> => item !== null)
  ) {
    const important = values[0].important;

    const sameImportance = values.every((item) => item.important === important);

    if (sameImportance) {
      const shorthandValue = definition.collapse(
        values.map((item) => item.value),
      );

      if (shorthandValue !== null) {
        return [parseDeclaration(shorthand, shorthandValue, important)];
      }
    }
  }

  /*
   * If shorthand preservation isn't possible, write the
   * effective longhands.
   *
   * This preserves semantics even with mixed importance or
   * incomplete shorthand state.
   */
  return values
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map((item) => parseDeclaration(item.property, item.value, item.important));
}

const borderLonghand =
  /^border-(?:(?:top|right|bottom|left)-(?:width|style|color)|(?:top|bottom)-(?:left|right)-radius)$/;

/**
 * Updates an authored declaration.
 *
 * For shorthand-family members this synchronizes the entire
 * family rather than leaving redundant declarations such as:
 *
 * padding: 24px;
 * padding-top: 77px;
 * padding-right: 104px;
 */
export function setDeclaration(
  rule: Rule,
  property: string,
  value: string,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): void {
  const family = getShorthandFamily(property, shorthandFamilies);

  /*
   * Build/validate the new declarations before modifying the
   * AST so invalid input cannot destroy the existing CSS.
   */
  const nextDeclarations: Declaration[] = family
    ? getFamilyWriteDeclarations(
        rule,
        family,
        property,
        value,
        getExpandedRuleDeclarations(rule, shorthandFamilies),
      )
    : [
        parseDeclaration(
          property,
          value,
          (borderLonghand.test(property)
            ? getExpandedRuleDeclarations(rule, shorthandFamilies)[property]
                ?.important
            : getLastAuthoredDeclaration(rule, property)?.important) ?? false,
        ),
      ];

  /*
   * Family edits replace all authored members of that family.
   *
   * Non-family edits replace only the matching property.
   */
  csstree.walk(rule.block, {
    visit: "Declaration",

    enter(node, item, list) {
      if (!item || !list) {
        return;
      }

      const declaration = node as Declaration;

      const shouldRemove = family
        ? isFamilyProperty(family, declaration.property)
        : declaration.property === property;

      if (shouldRemove) {
        list.remove(item);
      }
    },
  });

  nextDeclarations.forEach((declaration) => {
    rule.block.children.appendData(declaration);
  });
}

/**
 * Removes an authored declaration.
 *
 * Shorthand families are handled symmetrically with setDeclaration().
 *
 * Clearing the shorthand removes the entire family. Clearing one longhand
 * removes that effective value while preserving the remaining sibling values.
 */
export function removeDeclaration(
  rule: Rule,
  property: string,
  shorthandFamilies: ShorthandFamilies = SHORTHAND_FAMILY,
): void {
  const family = getShorthandFamily(property, shorthandFamilies);

  if (!family) {
    csstree.walk(rule.block, {
      visit: "Declaration",

      enter(node, item, list) {
        if (!item || !list) {
          return;
        }

        const declaration = node as Declaration;

        if (declaration.property === property) {
          list.remove(item);
          return;
        }

        if (
          !borderLonghand.test(property) ||
          !declaration.property.startsWith("border")
        )
          return;
        const value = csstree.generate(declaration.value);
        // A substitution can supply the entire shorthand, so splitting it before
        // variable resolution could change the other edges.
        if (
          /\b(?:var|env|attr)\(|^(?:initial|inherit|unset|revert(?:-layer)?)$/i.test(
            value,
          )
        )
          return;
        const expanded = expandWithBShort(
          declaration.property,
          value,
          !!declaration.important,
        );
        if (!expanded?.some((entry) => entry.property === property)) return;

        for (const entry of expanded) {
          if (entry.property !== property) {
            list.insertData(
              parseDeclaration(entry.property, entry.value, entry.important),
              item,
            );
          }
        }
        if (declaration.property === "border") {
          list.insertData(
            parseDeclaration("border-image", "none", !!declaration.important),
            item,
          );
        }
        list.remove(item);
      },
    });

    return;
  }

  const existing = getExpandedRuleDeclarations(rule, shorthandFamilies);

  /*
   * If the shorthand itself is cleared, remove the whole family.
   *
   * If a longhand is cleared, preserve all effective sibling longhands.
   * The shorthand cannot remain authored because it would recreate the
   * longhand that the user just removed.
   */
  const nextDeclarations: Declaration[] =
    property === family.shorthand
      ? []
      : family.longhands
          .filter((longhand) => longhand !== property)
          .flatMap((longhand) => {
            const declaration = existing[longhand];

            if (!declaration) {
              return [];
            }

            return [
              parseDeclaration(
                longhand,
                declaration.value,
                declaration.important,
              ),
            ];
          });

  csstree.walk(rule.block, {
    visit: "Declaration",

    enter(node, item, list) {
      if (!item || !list) {
        return;
      }

      const declaration = node as Declaration;

      if (isFamilyProperty(family, declaration.property)) {
        list.remove(item);
      }
    },
  });

  nextDeclarations.forEach((declaration) => {
    rule.block.children.appendData(declaration);
  });
}

export function appendRuleWithDeclaration(
  ast: StyleSheet,
  selector: string,
  property: string,
  value: string,
): Rule {
  const rule = csstree.parse(`${selector}{${property}:${value}}`, {
    context: "rule",
  }) as Rule;

  ast.children.appendData(rule);

  return rule;
}

// #endregion
