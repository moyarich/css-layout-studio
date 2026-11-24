import { useCallback, useMemo, useState } from "react";
import type { Rule } from "css-tree";
import {
  appendRuleWithDeclaration,
  formatCss,
  generateCss,
  getMatchingRules,
  parseCssSource,
  removeDeclaration,
  setDeclaration,
} from "./css";
import { createEditorDocument } from "./document";
import {
  findElementByEditorId,
  firstElementId,
  parseHtmlSource,
  preferredSelector,
  serializeHtml,
  serializePreviewHtml,
} from "./html";
import type {
  ComputedSnapshot,
  EditorDocument,
  EditorNodeId,
  PresetSource,
  SourceError,
} from "./types";
import {
  BORDER_FIELDS,
  BORDER_RADIUS_FIELDS,
} from "../components/Inspector/CSSFields";
import type { SelectedPreviewElement } from "../components/Preview/Preview";

const COMPUTED_PROPERTIES = [
  "display",
  "position",
  "flex-direction",
  "flex-wrap",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "order",
  "justify-content",
  "align-items",
  "align-content",
  "align-self",
  "grid-template-columns",
  "grid-template-rows",
  "grid-auto-flow",
  "grid-auto-columns",
  "grid-auto-rows",
  "grid-column",
  "grid-row",
  "grid-area",
  "justify-items",
  "justify-self",
  "gap",
  "width",
  "height",
  "min-width",
  "padding",
  "margin",
  "min-height",
  "max-width",
  "max-height",
  "overflow",
  "background",
  "border",
  "border-radius",
  ...BORDER_FIELDS.map(({ property }) => property),
  ...BORDER_RADIUS_FIELDS.map(({ property }) => property),
  "box-shadow",
  "clip-path",
  "opacity",
  "color",
  "font-size",
  "font-weight",
  "line-height",
  "text-align",
];

export function useLayoutEditor(initialPreset: PresetSource) {
  const [document, setDocument] = useState<EditorDocument>(() =>
    createEditorDocument(initialPreset),
  );
  // Keep the authored/formatted editor buffer separate from the executable
  // AST. Regenerating this string from css-tree on every render minifies it and
  // can overwrite Monaco while the user is typing.
  const [cssSource, setCssSource] = useState(initialPreset.css.trim());
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [previewSelection, setPreviewSelection] =
    useState<SelectedPreviewElement | null>(null);
  const [computed, setComputed] = useState<ComputedSnapshot>({});
  const [sourceError, setSourceError] = useState<SourceError>(null);
  const htmlSource = useMemo(
    () => serializeHtml(document.htmlAst),
    [document.htmlAst, document.revision],
  );
  const previewHtml = useMemo(
    () => serializePreviewHtml(document.htmlAst),
    [document.htmlAst, document.revision],
  );
  const previewCss = useMemo(
    () => generateCss(document.cssAst),
    [document.cssAst, document.revision],
  );
  const selectedHastElement = useMemo(
    () => findElementByEditorId(document.htmlAst, document.selectedNodeId),
    [document.htmlAst, document.selectedNodeId, document.revision],
  );

  const preferredRule = useMemo<Rule | null>(() => {
    if (!selectedElement) return null;
    const matches = getMatchingRules(document.cssAst, selectedElement);
    return matches.at(-1)?.rule ?? null;
  }, [document.cssAst, document.revision, selectedElement]);

  const refreshComputed = useCallback(
    (selection: SelectedPreviewElement | null) => {
      const element = selection?.element ?? null;
      setPreviewSelection(selection);
      setSelectedElement(element);
      if (!element) {
        setComputed({});
        return;
      }
      const style = getComputedStyle(element);
      setComputed(
        Object.fromEntries(
          COMPUTED_PROPERTIES.map((property) => [
            property,
            style.getPropertyValue(property),
          ]),
        ),
      );
    },
    [],
  );

  const bump = useCallback(() => {
    setDocument((current) => ({ ...current, revision: current.revision + 1 }));
  }, []);

  const selectNode = useCallback((id: EditorNodeId) => {
    setDocument((current) => ({ ...current, selectedNodeId: id }));
  }, []);

  const editDeclaration = useCallback(
    (rule: Rule | null, property: string, value: string) => {
      if (!value.trim()) return;

      let targetRule = rule;
      if (!targetRule) {
        const hastElement = findElementByEditorId(
          document.htmlAst,
          document.selectedNodeId,
        );
        if (!hastElement) return;
        targetRule = appendRuleWithDeclaration(
          document.cssAst,
          preferredSelector(hastElement),
          property,
          value,
        );
      } else {
        setDeclaration(targetRule, property, value);
      }
      setSourceError(null);
      setCssSource(formatCss(document.cssAst));
      bump();
    },
    [bump, document.cssAst, document.htmlAst, document.selectedNodeId],
  );

  const resetDeclaration = useCallback(
    (rule: Rule | null, property: string) => {
      if (!rule) return;
      removeDeclaration(rule, property);
      setSourceError(null);
      setCssSource(formatCss(document.cssAst));
      bump();
    },
    [bump, document.cssAst],
  );

  const loadPreset = (preset: PresetSource) => {
    setDocument(createEditorDocument(preset));
    setCssSource(preset.css.trim());
    setSourceError(null);
    setSelectedElement(null);
    setPreviewSelection(null);
    setComputed({});
  };

  const applyHtmlSource = (source: string) => {
    try {
      const htmlAst = parseHtmlSource(source);
      setDocument((current) => ({
        ...current,
        htmlAst,
        selectedNodeId: firstElementId(htmlAst),
        revision: current.revision + 1,
      }));
      setSourceError(null);
    } catch (error) {
      setSourceError({
        panel: "html",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const applyCssSource = (source: string) => {
    try {
      const cssAst = parseCssSource(source);
      setDocument((current) => ({
        ...current,
        cssAst,
        revision: current.revision + 1,
      }));
      setCssSource(source);
      setSourceError(null);
    } catch (error) {
      setSourceError({
        panel: "css",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return {
    document,
    htmlSource,
    cssSource,
    previewHtml,
    previewCss,
    selectedElement,
    previewSelection,
    computed,
    sourceError,
    selectedHastElement,
    preferredRule,
    refreshComputed,
    selectNode,
    editDeclaration,
    resetDeclaration,
    loadPreset,
    applyHtmlSource,
    applyCssSource,
  };
}
