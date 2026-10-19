import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./inspector.css";

import ShadcnForm from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import type { Rule, StyleSheet } from "css-tree";
import { Search, X } from "lucide-react";

import type { ComputedSnapshot } from "../../editor/types";
import { getMatchingRules, mergeExpandedDeclarations } from "../../editor/css";

import { InspectorFieldTemplate } from "./schemas/InspectorFieldTemplate";
import { inspectorCustomFields } from "./schemas/CustomFields";

import {
  applyInspectorFieldVisibility,
  filterInspectorSections,
  filterSectionsWithDeclarations,
  getGroupsWithDeclarations,
  getInspectorFieldEntries,
  getInspectorFormValue,
  hasInspectorFormValue,
  getInspectorGroupIds,
  INITIALLY_OPEN_GROUPS,
  type InspectorFieldVisibilityRule,
  createInspectorFormData,
  mergeInspectorSchemas,
  createInspectorUiSchema,
} from "./inspector-utils";

import { inspectorWidgets, type InspectorFormData } from "./inspector-model";

import { useDebouncedCallback } from "../../hooks/useDebounce";
import { ElementLayoutInfo } from "../../types";
import { getInspectorSections } from "./InspectorSectionDefinitions";

type InspectorProps = {
  cssAst: StyleSheet;
  revision: number;
  selectedElement: HTMLElement | null;
  computed: ComputedSnapshot;
  preferredRule: Rule | null;
  layout: ElementLayoutInfo | null;
  onChange: (rule: Rule | null, property: string, value: string) => void;
  onReset: (rule: Rule | null, property: string) => void;
  fieldVisibility?: InspectorFieldVisibilityRule[];
};

const NO_FIELD_VISIBILITY_RULES: InspectorFieldVisibilityRule[] = [];

const INSPECTOR_CHANGE_DELAY = 2000;

export function Inspector({
  cssAst,
  revision,
  selectedElement,
  computed,
  preferredRule,
  layout,
  onChange,
  onReset,
  fieldVisibility = NO_FIELD_VISIBILITY_RULES,
}: InspectorProps) {
  const matching = useMemo(
    () => (selectedElement ? getMatchingRules(cssAst, selectedElement) : []),
    [cssAst, revision, selectedElement],
  );

  const activeRule = preferredRule ?? matching.at(-1)?.rule ?? null;

  const activeSelector =
    matching.find((entry) => entry.rule === activeRule)?.selector ?? "new rule";

  const declarations = useMemo(
    () => mergeExpandedDeclarations(matching.map((entry) => entry.rule)),
    [matching],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [presetOnly, setPresetOnly] = useState(false);

  const baseSections = useMemo(
    () =>
      applyInspectorFieldVisibility(
        getInspectorSections(layout),
        fieldVisibility,
      ),
    [layout, fieldVisibility],
  );

  const sections = useMemo(
    () =>
      filterInspectorSections(
        presetOnly
          ? filterSectionsWithDeclarations(baseSections, declarations)
          : baseSections,
        searchQuery,
      ),
    [baseSections, declarations, presetOnly, searchQuery],
  );

  const groupIds = useMemo(
    () => getInspectorGroupIds(baseSections),
    [baseSections],
  );

  const dataGroupIds = useMemo(
    () => getGroupsWithDeclarations(baseSections, declarations),
    [baseSections, declarations],
  );

  const knownGroupIds = useRef(new Set<string>());
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    setVisible((current) => {
      const currentSet = new Set(current);

      groupIds.forEach((id) => {
        if (
          dataGroupIds.includes(id) ||
          (!knownGroupIds.current.has(id) && INITIALLY_OPEN_GROUPS.has(id))
        ) {
          currentSet.add(id);
        }
      });

      knownGroupIds.current = new Set(groupIds);

      const next = groupIds.filter((id) => currentSet.has(id));

      return next.length === current.length &&
        next.every((id, index) => id === current[index])
        ? current
        : next;
    });
  }, [groupIds, dataGroupIds]);

  const setGroupVisible = useCallback((id: string, isVisible: boolean) => {
    setVisible((current) =>
      isVisible
        ? current.includes(id)
          ? current
          : [...current, id]
        : current.filter((groupId) => groupId !== id),
    );
  }, []);

  const schema = useMemo(() => mergeInspectorSchemas(sections), [sections]);

  const uiSchema = useMemo(
    () => createInspectorUiSchema(sections, computed, declarations),
    [sections, computed, declarations],
  );

  const ruleForProperty = (property: string) =>
    declarations[property]?.rule ?? activeRule;

  const fieldEntries = useMemo(
    () => getInspectorFieldEntries(sections),
    [sections],
  );

  const canonicalFormData = useMemo(
    () => createInspectorFormData(fieldEntries, declarations),
    [declarations, fieldEntries],
  );

  // -------------------------------------------------------------------------
  // RJSF draft
  // -------------------------------------------------------------------------

  const [formData, setFormData] =
    useState<InspectorFormData>(canonicalFormData);

  const formDataRef = useRef<InspectorFormData>(canonicalFormData);

  /**
   * Tracks whether an inspector field currently owns an editing session.
   *
   * While editing:
   *
   * - RJSF formData updates immediately.
   * - CSS AST updates are debounced.
   * - canonicalFormData must not overwrite the active draft.
   */
  const editingFieldRef = useRef<string | null>(null);

  useEffect(() => {
    /**
     * Do not replace an active RJSF draft with canonical data generated from
     * the CSS AST.
     *
     * A debounced inspector commit changes the AST, which changes
     * canonicalFormData. Replacing formData at that point is what causes text
     * inputs to jump/rollback while the user is still typing.
     */
    if (editingFieldRef.current) {
      return;
    }

    formDataRef.current = canonicalFormData;
    setFormData(canonicalFormData);
  }, [canonicalFormData]);

  // -------------------------------------------------------------------------
  // Apply formData to CSS AST
  // -------------------------------------------------------------------------

  const applyFormData = useCallback(
    (nextData: InspectorFormData, changedFieldId?: string) => {
      fieldEntries.forEach(({ path, property }) => {
        const previous = getInspectorFormValue(
          canonicalFormData,
          path,
          property,
        );

        const next = getInspectorFormValue(nextData, path, property);

        if (next === previous) {
          return;
        }

        const isPresent = hasInspectorFormValue(nextData, path, property);

        const isChangedField =
          changedFieldId?.endsWith(`_${property}`) ?? false;

        /**
         * RJSF change payloads may omit untouched nested values.
         *
         * Missing data does not mean an existing declaration should be
         * removed unless this is actually the field that changed.
         */
        if (!isPresent && !isChangedField) {
          return;
        }

        const rule = ruleForProperty(property);

        if (!next.trim()) {
          onReset(rule, property);
        } else {
          onChange(rule, property, next);
        }
      });
    },
    [
      activeRule,
      canonicalFormData,
      declarations,
      fieldEntries,
      onChange,
      onReset,
    ],
  );

  /**
   * CSS AST / preview changes are more expensive than updating the local
   * RJSF draft.
   *
   * Each new RJSF change cancels the previous scheduled commit and starts
   * another delay.
   */
  const commitFormData = useDebouncedCallback(
    applyFormData,
    INSPECTOR_CHANGE_DELAY,
  );

  useEffect(() => {
    /**
     * A source edit or preset load can replace the AST.
     *
     * Do not allow an older pending inspector commit to run afterward and
     * overwrite newer source changes.
     */
    commitFormData.cancel();
  }, [cssAst, revision, commitFormData]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      <div className="inspector-panel-heading">
        <div>
          <strong>Inspector</strong>

          <div className="inspector-panel-kicker">
            {layout && (
              <strong>
                {layout.role === "both" ? "Item and container" : layout.role}
              </strong>
            )}
          </div>
        </div>

        <div className="inspector-rule">
          <span className="inspector-panel-kicker">CSS target</span>

          <code>{activeSelector}</code>
        </div>
      </div>

      <div className="inspector">
        <div className="inspector-controls">
          <div className="inspector-visibility-toolbar">
            <span>
              {visible.length} of {groupIds.length} sections open
            </span>

            <div>
              <button type="button" onClick={() => setVisible(groupIds)}>
                Show all
              </button>

              <button type="button" onClick={() => setVisible([])}>
                Hide all
              </button>
            </div>
          </div>

          <div className="inspector-filter-bar">
            <div className="inspector-search">
              <Search size={13} aria-hidden="true" />

              <input
                type="search"
                value={searchQuery}
                placeholder="Find a property or section…"
                aria-label="Search inspector properties"
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />

              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear inspector search"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              className={`inspector-preset-filter${
                presetOnly ? " active" : ""
              }`}
              aria-pressed={presetOnly}
              onClick={() => setPresetOnly((current) => !current)}
            >
              <span aria-hidden="true" /> Preset values
            </button>
          </div>
        </div>

        {layout?.showLayoutUi ? (
          <div className="layout-summary">
            <span className="inspector-panel-kicker">Layout</span>

            <small>
              {layout.isItem ? `${layout.parentContainerKind} item` : ""}

              {layout.isItem && layout.isContainer ? " · " : ""}

              {layout.isContainer ? `${layout.containerKind} container` : ""}
            </small>
          </div>
        ) : null}

        {sections.length ? (
          <ShadcnForm
            className="inspector-schema-form"
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            validator={validator}
            fields={inspectorCustomFields}
            widgets={inspectorWidgets}
            formContext={{
              visible,
              setGroupVisible,
              dataGroupIds,
            }}
            templates={{
              FieldTemplate: InspectorFieldTemplate,
            }}
            onFocus={(id) => {
              /**
               * RJSF reports that this field owns focus.
               *
               * canonicalFormData should not replace the draft while this
               * editing session is active.
               */
              editingFieldRef.current = id;
            }}
            onChange={(event, id) => {
              const nextFormData = event.formData as InspectorFormData;

              /**
               * Update the RJSF draft synchronously so the input always
               * reflects the character/value the user just entered.
               */
              formDataRef.current = nextFormData;
              setFormData(nextFormData);

              /**
               * RJSF's onChange id is optional. When an input becomes empty,
               * RJSF may remove that property from formData entirely. Falling
               * back to the focused field lets applyFormData distinguish an
               * intentional deletion from an untouched omitted nested value.
               */
              const changedFieldId = id ?? editingFieldRef.current ?? undefined;

              commitFormData(nextFormData, changedFieldId);
            }}
            onBlur={(id) => {
              /**
               * Only end the edit session for the field that actually owned
               * it. This avoids an unrelated blur clearing another field's
               * editing protection.
               */
              if (editingFieldRef.current === id) {
                editingFieldRef.current = null;
              }

              /**
               * Apply a pending inspector change immediately on a genuine
               * blur. The field no longer depends on blur for committing;
               * normal typing still commits through the debounce.
               */
              commitFormData.flush();
            }}
          >
            <></>
          </ShadcnForm>
        ) : (
          <div className="inspector-search-empty">
            <Search size={16} aria-hidden="true" />

            <strong>No matching controls</strong>

            <span>Try a CSS property, section, or description.</span>

            <button type="button" onClick={() => setSearchQuery("")}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
