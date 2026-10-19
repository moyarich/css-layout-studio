
import type { WidgetProps } from "@rjsf/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import "./CssSelectWidget.css";

type SelectOption = { label: string; value: string };

export function CssSelectWidget(props: WidgetProps) {
  const generatedId = useId().replace(/:/g, "");
  const popoverId = `${props.id}-${generatedId}-popover`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const options = useMemo<SelectOption[]>(() => {
    const enumOptions = Array.isArray(props.options.enumOptions)
      ? props.options.enumOptions
      : [];
    if (enumOptions.length) {
      return enumOptions.map((option) => ({
        label: String(option.label ?? option.value),
        value: String(option.value),
      }));
    }
    return Array.isArray(props.schema.enum)
      ? props.schema.enum.map((value) => ({
          label: String(value),
          value: String(value),
        }))
      : [];
  }, [props.options.enumOptions, props.schema.enum]);

  const value = String(props.value ?? "");
  const selected = options.find((option) => option.value === value);
  const disabled = props.disabled || props.readonly;

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const handleToggle = (event: Event) => {
      const nextOpen = (event as ToggleEvent).newState === "open";
      setOpen(nextOpen);
      if (nextOpen) {
        requestAnimationFrame(() => {
          const selectedOption = popover.querySelector<HTMLElement>(
            "[aria-selected='true']",
          );
          (
            selectedOption ??
            popover.querySelector<HTMLElement>("[role='option']")
          )?.focus();
        });
      }
    };
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  const positionPopover = () => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;
    const rect = trigger.getBoundingClientRect();
    const gutter = 10;
    const width = Math.min(360, Math.max(190, rect.width));
    const left = Math.min(
      window.innerWidth - width - gutter,
      Math.max(gutter, rect.left),
    );
    const rows = Math.ceil(
      Math.max(options.length, 1) / (options.length > 4 ? 2 : 1),
    );
    const desiredHeight = Math.min(320, 48 + rows * 35);
    const roomBelow = window.innerHeight - rect.bottom - gutter;
    const roomAbove = rect.top - gutter;
    const placeAbove =
      roomBelow < Math.min(180, desiredHeight) && roomAbove > roomBelow;
    const availableHeight = Math.max(
      110,
      placeAbove ? roomAbove - 6 : roomBelow - 6,
    );
    const top = placeAbove
      ? Math.max(
          gutter,
          rect.top - Math.min(desiredHeight, availableHeight) - 6,
        )
      : rect.bottom + 6;

    popover.dataset.placement = placeAbove ? "top" : "bottom";
    popover.style.setProperty("--css-select-left", `${left}px`);
    popover.style.setProperty("--css-select-top", `${top}px`);
    popover.style.setProperty("--css-select-width", `${width}px`);
    popover.style.setProperty(
      "--css-select-max-height",
      `${availableHeight}px`,
    );
  };

  const showPopover = () => {
    if (disabled) return;
    positionPopover();
    popoverRef.current?.showPopover();
  };

  const selectValue = (nextValue: string) => {
    props.onChange(nextValue, undefined, props.id);
    popoverRef.current?.hidePopover();
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      showPopover();
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = (index + 1) % options.length;
      popoverRef.current
        ?.querySelectorAll<HTMLElement>("[role='option']")
        [next]?.focus();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const previous = (index - 1 + options.length) % options.length;
      popoverRef.current
        ?.querySelectorAll<HTMLElement>("[role='option']")
        [previous]?.focus();
    } else if (event.key === "Escape") {
      popoverRef.current?.hidePopover();
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="css-select-widget">
      <button
        ref={triggerRef}
        id={props.id}
        name={props.htmlName}
        type="button"
        className="css-select-trigger"
        role="combobox"
        aria-controls={popoverId}
        aria-expanded={open}
        aria-haspopup="listbox"
        popoverTarget={popoverId}
        popoverTargetAction="toggle"
        disabled={disabled}
        onClick={positionPopover}
        onKeyDown={handleTriggerKeyDown}
        onBlur={() => props.onBlur(props.id, value)}
        onFocus={() => props.onFocus(props.id, value)}
      >
        <span className={selected ? "" : "css-select-placeholder"}>
          {selected?.label ?? props.placeholder ?? "Preset: unset"}
        </span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        className="css-select-popover"
        popover="auto"
        role="listbox"
        aria-label={`${props.label} options`}
        style={
          {
            "--css-select-columns": options.length > 4 ? 2 : 1,
          } as CSSProperties
        }
      >
        <div className="css-select-popover-header" aria-hidden="true">
          <span>Choose {props.label}</span>
          <small>{options.length} options</small>
        </div>
        <div className="css-select-options">
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isSelected || (!selected && index === 0) ? 0 : -1}
                onClick={() => selectValue(option.value)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span>{option.label}</span>
                <span className="css-select-check">
                  {isSelected ? <Check size={12} aria-hidden="true" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

