import type { WidgetProps } from "@rjsf/utils";
import { Braces, Check, Ellipsis, Hash, SlidersHorizontal } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

function numberOption(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

const inputModes = [
  { id: "range", label: "Slider", icon: SlidersHorizontal },
  { id: "number", label: "Number", icon: Hash },
  { id: "text", label: "CSS value", icon: Braces },
] as const;
type InputMode = (typeof inputModes)[number]["id"];

function CssRangeModeMenu({
  mode,
  canUseNumber,
  canUseSlider,
  onChange,
}: {
  mode: InputMode;
  canUseNumber: boolean;
  canUseSlider: boolean;
  onChange: (mode: InputMode) => void;
}) {
  const id = useId();
  const menu = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const focusOnOpen = useRef<"active" | "first" | "last">("active");

  function placeMenu(target: HTMLButtonElement) {
    const popover = menu.current;
    if (!popover) return;
    const rect = target.getBoundingClientRect();
    const above = window.innerHeight - rect.bottom < 112 && rect.top > 112;
    popover.style.top = above ? "auto" : `${rect.bottom + 4}px`;
    popover.style.bottom = above
      ? `${window.innerHeight - rect.top + 4}px`
      : "auto";
    popover.style.right = `clamp(8px, ${window.innerWidth - rect.right}px, calc(100vw - 152px))`;
  }

  return (
    <>
      <button
        type="button"
        className="css-range-mode"
        aria-label="Input mode"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        ref={trigger}
        title="Input mode"
        popoverTarget={id}
        onClick={(event) => {
          if (!menu.current?.matches(":popover-open"))
            placeMenu(event.currentTarget);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          focusOnOpen.current = event.key === "ArrowDown" ? "first" : "last";
          event.currentTarget.click();
        }}
      >
        <Ellipsis size={17} aria-hidden="true" />
      </button>
      <div
        id={id}
        ref={menu}
        popover="auto"
        role="menu"
        aria-label="Input mode"
        className="css-range-mode-menu"
        onToggle={(event) => {
          const isOpen = event.newState === "open";
          setOpen(isOpen);
          if (!isOpen) return;
          const popover = event.currentTarget;
          const items = popover.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)",
          );
          const focus = focusOnOpen.current;
          focusOnOpen.current = "active";
          const item =
            focus === "active"
              ? popover.querySelector<HTMLButtonElement>(
                  '[aria-checked="true"]',
                )
              : items[focus === "first" ? 0 : items.length - 1];
          item?.focus({ preventScroll: true });
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" || event.key === "Tab") {
            if (event.key === "Escape") event.preventDefault();
            menu.current?.hidePopover();
            trigger.current?.focus({ preventScroll: true });
            return;
          }
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ),
          );
          const active = items.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          let next: number;
          switch (event.key) {
            case "ArrowDown":
              next = (active + 1) % items.length;
              break;
            case "ArrowUp":
              next = (active + items.length - 1) % items.length;
              break;
            case "Home":
              next = 0;
              break;
            case "End":
              next = items.length - 1;
              break;
            default:
              return;
          }
          event.preventDefault();
          items[next]?.focus();
        }}
      >
        {inputModes.map(({ id: option, label, icon: Icon }) => (
          <button
            key={option}
            type="button"
            role="menuitemradio"
            aria-checked={mode === option}
            disabled={
              option === "range"
                ? !canUseSlider
                : option === "number" && !canUseNumber
            }
            tabIndex={-1}
            onClick={() => {
              menu.current?.hidePopover();
              if (option === mode)
                trigger.current?.focus({ preventScroll: true });
              else onChange(option);
            }}
          >
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
            {mode === option && <Check size={13} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </>
  );
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
  const defaultMax = numberOption(props.options.rangeMax, 100);
  const defaultStep = numberOption(props.options.rangeStep, 1);
  const defaultUnit =
    typeof props.options.rangeUnit === "string"
      ? props.options.rangeUnit
      : "px";
  const units = Array.isArray(props.options.rangeUnits)
    ? props.options.rangeUnits.filter(
        (unit): unit is string => typeof unit === "string",
      )
    : [defaultUnit];
  const [emptyUnit, setEmptyUnit] = useState(defaultUnit);
  const scalar = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)([a-z]+|%)?$/i.exec(
    localValue.trim(),
  );
  const authoredUnit = scalar?.[2]?.toLowerCase();
  const unit = authoredUnit ?? (!localValue.trim() ? emptyUnit : defaultUnit);
  const percentMax = props.options.rangePercentMax;
  const max = unit === "%" ? numberOption(percentMax, defaultMax) : defaultMax;
  const step =
    unit === "%"
      ? numberOption(props.options.rangePercentStep, defaultStep)
      : defaultStep;
  const parsed = Number(scalar?.[1]);
  const numericValue = Math.min(
    max,
    Math.max(min, Number.isFinite(parsed) ? parsed : min),
  );
  const cssValue = `${numericValue}${unit}`;
  const numberInputValue = scalar ? parsed : "";
  const toNumberCssValue = (value: string) =>
    value.trim() ? `${value}${unit}` : "";
  const [preferredMode, setPreferredMode] = useState<InputMode>(
    props.options.rangeDefaultMode === "number"
      ? "number"
      : scalar || props.value === undefined
        ? "range"
        : "text",
  );
  const canUseNumber =
    !localValue.trim() ||
    (Number.isFinite(parsed) &&
      (authoredUnit
        ? units.includes(authoredUnit)
        : parsed === 0 || units.includes("")));
  const canUseSlider =
    canUseNumber && (!scalar || (parsed >= min && parsed <= max));
  const mode = !canUseNumber
    ? "text"
    : preferredMode === "range" && !canUseSlider
      ? "number"
      : preferredMode;

  const focusOnModeChange = useRef(false);
  useLayoutEffect(() => {
    if (!focusOnModeChange.current) return;
    focusOnModeChange.current = false;
    document.getElementById(props.id)?.focus({ preventScroll: true });
  }, [mode, props.id]);

  const modeButton = (
    <CssRangeModeMenu
      mode={mode}
      canUseNumber={canUseNumber}
      canUseSlider={canUseSlider}
      onChange={(nextMode) => {
        focusOnModeChange.current = true;
        setPreferredMode(nextMode);
      }}
    />
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
          onChange={(event) => {
            setPreferredMode("text");
            updateValue(event.currentTarget.value);
          }}
          onBlur={(event) => finishValue(event.currentTarget.value)}
          onFocus={(event) =>
            props.onFocus(props.id, event.currentTarget.value)
          }
        />
        {modeButton}
      </div>
    );
  }

  const unitControl =
    units.length > 1 ? (
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
    ) : unit ? (
      <span className="css-range-unit">{unit}</span>
    ) : null;

  if (mode === "number") {
    return (
      <div className="css-range-widget css-range-widget-number">
        <div className="css-range-value">
          <input
            id={props.id}
            name={props.htmlName}
            type="number"
            step="any"
            value={numberInputValue}
            disabled={props.disabled || props.readonly}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (!value) setEmptyUnit(unit);
              updateValue(toNumberCssValue(value));
            }}
            onBlur={(event) =>
              finishValue(toNumberCssValue(event.currentTarget.value))
            }
            onFocus={(event) =>
              props.onFocus(
                props.id,
                toNumberCssValue(event.currentTarget.value),
              )
            }
          />
          {unitControl}
        </div>
        {modeButton}
      </div>
    );
  }

  return (
    <div className="css-range-widget css-range-widget-slider">
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
      <div className="css-range-value">
        <output htmlFor={props.id}>{numericValue}</output>
        {unitControl}
      </div>
      {modeButton}
    </div>
  );
}
