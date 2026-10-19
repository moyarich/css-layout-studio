import type { WidgetProps } from "@rjsf/utils";
import { Braces, Hash, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function numberOption(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function CssRangeWidget(props: WidgetProps) {
  const externalValue = String(props.value ?? "");
  const [localValue, setLocalValue] = useState(externalValue);
  const latestValueRef = useRef(externalValue);
  const draggingRef = useRef(false);

  useEffect(() => {
    // External form/AST changes are authoritative. They update the displayed
    // value but must never be echoed back as a user edit (especially while a
    // preset is mounting and RJSF is still registering its fields).
    latestValueRef.current = externalValue;
    setLocalValue(externalValue);
  }, [externalValue]);

  const updateValue = (nextValue: string, publish = true) => {
    latestValueRef.current = nextValue;
    setLocalValue(nextValue);
    // The inspector form owns the single debounce boundary. Publishing here
    // immediately keeps RJSF's local draft in sync and avoids stacking delays.
    if (publish) props.onChange(nextValue, undefined, props.id);
  };

  const publishDraggedValue = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    props.onChange(latestValueRef.current, undefined, props.id);
  };

  const finishValue = (nextValue: string) => {
    props.onBlur(props.id, nextValue);
  };

  const min = numberOption(props.options.rangeMin, 0);
  const max = numberOption(props.options.rangeMax, 100);
  const step = numberOption(props.options.rangeStep, 1);
  const defaultUnit =
    typeof props.options.rangeUnit === "string"
      ? props.options.rangeUnit
      : "px";
  const units = Array.isArray(props.options.rangeUnits)
    ? props.options.rangeUnits.filter(
        (unit): unit is string => typeof unit === "string",
      )
    : [defaultUnit];
  const authoredUnit = localValue.match(/[a-z%]+$/i)?.[0];
  const unit =
    authoredUnit && units.includes(authoredUnit) ? authoredUnit : defaultUnit;
  const parsed = Number.parseFloat(localValue || String(min));
  const numericValue = Math.min(
    max,
    Math.max(min, Number.isFinite(parsed) ? parsed : min),
  );
  const cssValue = `${numericValue}${unit}`;
  const numberInputValue = localValue.trim() ? numericValue : "";
  const toNumberCssValue = (value: string) =>
    value.trim() ? `${value}${unit}` : "";
  const numericSource = /^-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?$/i.test(localValue);
  const [mode, setMode] = useState<"range" | "number" | "text">(
    numericSource || props.value === undefined ? "range" : "text",
  );
  const nextMode =
    mode === "range" ? "number" : mode === "number" ? "text" : "range";
  const ModeIcon =
    mode === "range" ? SlidersHorizontal : mode === "number" ? Hash : Braces;
  const modeLabel =
    mode === "range" ? "Slider" : mode === "number" ? "Number" : "CSS value";

  const modeButton = (
    <button
      type="button"
      className="css-range-mode"
      aria-label={`${modeLabel} input; switch to ${nextMode}`}
      title={`${modeLabel} input · click for ${nextMode}`}
      onClick={() => setMode(nextMode)}
    >
      <ModeIcon size={12} aria-hidden="true" />
    </button>
  );

  if (mode === "text") {
    return (
      <div className="css-range-widget css-range-widget-text">
        <input
          id={props.id}
          name={props.htmlName}
          type="text"
          value={localValue}
          placeholder={props.placeholder}
          disabled={props.disabled || props.readonly}
          onChange={(event) => updateValue(event.currentTarget.value)}
          onBlur={(event) => finishValue(event.currentTarget.value)}
          onFocus={(event) =>
            props.onFocus(props.id, event.currentTarget.value)
          }
        />
        {modeButton}
      </div>
    );
  }

  const hasUnitSelector = units.length > 1 || units[0] !== "";
  const unitSelect = hasUnitSelector ? (
    <select
      className="css-range-unit"
      aria-label={`${props.label} unit`}
      value={unit}
      disabled={props.disabled || props.readonly}
      onChange={(event) => {
        if (!localValue.trim()) return;
        updateValue(`${numericValue}${event.currentTarget.value}`);
      }}
    >
      {units.map((option) => (
        <option key={option || "unitless"} value={option}>
          {option || "—"}
        </option>
      ))}
    </select>
  ) : null;

  if (mode === "number") {
    return (
      <div
        className={`css-range-widget css-range-widget-number${hasUnitSelector ? "" : " css-range-widget-unitless"}`}
      >
        <input
          id={props.id}
          name={props.htmlName}
          type="number"
          min={min}
          max={max}
          step={step}
          value={numberInputValue}
          disabled={props.disabled || props.readonly}
          onChange={(event) =>
            updateValue(toNumberCssValue(event.currentTarget.value))
          }
          onBlur={(event) =>
            finishValue(toNumberCssValue(event.currentTarget.value))
          }
          onFocus={(event) =>
            props.onFocus(props.id, toNumberCssValue(event.currentTarget.value))
          }
        />
        {unitSelect}
        {modeButton}
      </div>
    );
  }

  return (
    <div
      className={`css-range-widget${hasUnitSelector ? "" : " css-range-widget-unitless"}`}
    >
      <input
        id={props.id}
        name={props.htmlName}
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        disabled={props.disabled || props.readonly}
        autoFocus={props.autofocus}
        aria-valuetext={cssValue}
        onPointerDown={() => {
          draggingRef.current = true;
        }}
        onChange={(event) =>
          updateValue(
            `${event.currentTarget.value}${unit}`,
            !draggingRef.current,
          )
        }
        onPointerUp={publishDraggedValue}
        onPointerCancel={publishDraggedValue}
        onBlur={() => finishValue(cssValue)}
        onFocus={() => props.onFocus(props.id, cssValue)}
      />
      <output htmlFor={props.id}>{numericValue}</output>
      {unitSelect}
      {modeButton}
    </div>
  );
}
