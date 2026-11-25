import clsx from "clsx";

import { Info, ExternalLink } from "lucide-react";
import {
  getTemplate,
  getUiOptions,
  type FieldTemplateProps,
} from "@rjsf/utils";
import { useEffect, useId, useRef, useState } from "react";
import type { InspectorWidgetId } from "../inspector-model";
import { InspectorFieldActions } from "./InspectorFieldActions";

type InspectorUiOptions = {
  widget?: string;
  widgetId?: InspectorWidgetId;
  cssProperty?: string;
  computedValue?: string;
  authoredValue?: string;
  sourceProperty?: string;
  sourceValue?: string;
  fromShorthand?: boolean;
  important?: boolean;
};

function FieldInfo({
  property,
  description,
  options,
}: {
  property: string;
  description?: string;
  options: InspectorUiOptions;
}) {
  const generatedId = useId().replace(/:/g, "");
  const popoverId = `field-info-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const authoredValue = options.authoredValue ?? "Not set in the matched rules";
  const source = options.sourceProperty
    ? `${options.sourceProperty}: ${options.sourceValue}${options.important ? " !important" : ""}`
    : "Browser or inherited default";

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const handleToggle = (event: Event) =>
      setOpen((event as ToggleEvent).newState === "open");
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  const positionPopover = () => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(320, Math.max(180, window.innerWidth - 20));
    const left = Math.min(
      window.innerWidth - width - 10,
      Math.max(10, rect.right - width),
    );
    const estimatedHeight = 230;
    const placeAbove =
      window.innerHeight - rect.bottom < estimatedHeight &&
      rect.top > estimatedHeight;
    popover.dataset.placement = placeAbove ? "top" : "bottom";
    popover.style.setProperty("--field-info-left", `${left}px`);
    popover.style.setProperty(
      "--field-info-top",
      `${placeAbove ? Math.max(10, rect.top - estimatedHeight - 6) : rect.bottom + 6}px`,
    );
    popover.style.setProperty("--field-info-width", `${width}px`);
  };

  return (
    <div className="inspector-field-info">
      <button
        ref={triggerRef}
        type="button"
        className="inspector-field-info-trigger"
        aria-label={`Show details for ${property}`}
        aria-expanded={open}
        aria-controls={popoverId}
        popoverTarget={popoverId}
        popoverTargetAction="toggle"
        onClick={positionPopover}
      >
        <Info size={11} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <div
        ref={popoverRef}
        id={popoverId}
        className="inspector-field-tooltip"
        popover="auto"
        role="dialog"
        aria-label={`${property} details`}
      >
        <span className="inspector-field-tooltip-title">
          <code>{property}</code>
          <span>CSS property</span>
        </span>
        {description ? (
          <span className="inspector-field-tooltip-copy">{description}</span>
        ) : null}
        <span className="inspector-field-tooltip-details">
          <span>
            <small>Computed</small>
            <code>{options.computedValue ?? "—"}</code>
          </span>
          <span>
            <small>Authored</small>
            <code>{authoredValue}</code>
          </span>
          <span>
            <small>{options.fromShorthand ? "Expanded from" : "Source"}</small>
            <code>{source}</code>
          </span>
        </span>
        <a
          href={`https://developer.mozilla.org/en-US/docs/Web/CSS/${encodeURIComponent(property)}`}
          target="_blank"
          rel="noreferrer"
        >
          MDN reference <ExternalLink size={11} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function InspectorFieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    children,
    displayLabel,
    rawErrors = [],
    errors,
    help,
    description,
    rawDescription,
    classNames,
    style,
    disabled,
    label,
    hidden,
    onKeyRename,
    onKeyRenameBlur,
    onRemoveProperty,
    readonly,
    required,
    schema,
    uiSchema,
    registry,
  } = props;
  const uiOptions = getUiOptions(uiSchema) as InspectorUiOptions;
  const [actionHost, setActionHost] = useState<HTMLDivElement | null>(null);
  const actionsInLabel = displayLabel && uiOptions.widgetId === "range";

  const WrapIfAdditionalTemplate = getTemplate(
    "WrapIfAdditionalTemplate",
    registry,
    uiOptions,
  );

  if (hidden) return <div className="hidden">{children}</div>;

  const isCheckbox = uiOptions.widget === "checkbox";
  const property = uiOptions.cssProperty;

  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      style={style}
      disabled={disabled}
      id={id}
      label={label}
      displayLabel={displayLabel}
      onKeyRename={onKeyRename}
      onKeyRenameBlur={onKeyRenameBlur}
      onRemoveProperty={onRemoveProperty}
      rawDescription={rawDescription}
      readonly={readonly}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      registry={registry}
    >
      <div className="flex flex-col gap-2">
        <div className="inspector-field-row">
          <div
            className={clsx("inspector-field-control", {
              [`${uiOptions.widgetId}-widget-wrapper`]: uiOptions.widgetId,
            })}
          >
            {displayLabel && !isCheckbox ? (
              <div
                className={`label-field-wrapper${uiOptions.sourceProperty ? " has-preset" : ""}`}
              >
                <label
                  className={rawErrors.length ? "text-destructive" : ""}
                  htmlFor={id}
                >
                  {label}
                  {required ? <span className="required">*</span> : null}
                </label>
                {actionsInLabel && (
                  <div className="inspector-field-actions">
                    {property && (
                      <FieldInfo
                        property={property}
                        description={rawDescription}
                        options={uiOptions}
                      />
                    )}
                    <div
                      ref={setActionHost}
                      className="inspector-field-mode-slot"
                    />
                  </div>
                )}
              </div>
            ) : null}
            {actionsInLabel ? (
              <InspectorFieldActions.Provider value={{ host: actionHost }}>
                {children}
              </InspectorFieldActions.Provider>
            ) : (
              children
            )}
          </div>
          {displayLabel && !isCheckbox && property && !actionsInLabel ? (
            <FieldInfo
              property={property}
              description={rawDescription}
              options={uiOptions}
            />
          ) : null}
        </div>
        <div className="additional-info">
          {displayLabel && rawDescription && !isCheckbox && !property
            ? description
            : null}
          {errors}
          {help}
        </div>
      </div>
    </WrapIfAdditionalTemplate>
  );
}
