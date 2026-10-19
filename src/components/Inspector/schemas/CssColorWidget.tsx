import type { WidgetProps } from "@rjsf/utils";
import { useMemo } from "react";

import "./CssColorWidget.css";

function isCssColor(value: string): boolean {
  const color = value.trim();

  if (!color) {
    return false;
  }

  return typeof CSS !== "undefined" && CSS.supports("color", color);
}

function cssColorToHex(value: string): string | null {
  if (typeof document === "undefined" || !isCssColor(value)) {
    return null;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.fillStyle = value;

  const normalized = context.fillStyle;

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return normalized;
  }

  const shortHex = normalized.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);

  if (shortHex) {
    return (
      `#${shortHex[1]}${shortHex[1]}` +
      `${shortHex[2]}${shortHex[2]}` +
      `${shortHex[3]}${shortHex[3]}`
    );
  }

  const rgb = normalized.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)/i,
  );

  if (!rgb) {
    return null;
  }

  return `#${[rgb[1], rgb[2], rgb[3]]
    .map((channel) => Math.round(Number(channel)).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function CssColorWidget(props: WidgetProps) {
  const value = typeof props.value === "string" ? props.value : "";

  const disabled = props.disabled || props.readonly;

  const valid = !value.trim() || isCssColor(value);

  const nativeValue = useMemo(() => cssColorToHex(value), [value]);

  const hasColor = nativeValue !== null;

  return (
    <div className="css-color-widget" data-invalid={!valid || undefined}>
      <div className="css-color-picker" data-empty={!hasColor || undefined}>
        <span
          className="css-color-swatch"
          style={
            hasColor
              ? {
                  backgroundColor: nativeValue,
                }
              : undefined
          }
        />

        <input
          id={`${props.id}-picker`}
          className="css-color-picker-input"
          type="color"
          value={nativeValue ?? "#000000"}
          disabled={disabled}
          aria-label={`Choose ${props.label}`}
          onChange={(event) => {
            props.onChange(event.currentTarget.value, undefined, props.id);
          }}
        />
      </div>

      <input
        id={props.id}
        name={props.htmlName}
        className="css-color-value"
        type="text"
        value={value}
        disabled={disabled}
        autoFocus={props.autofocus}
        placeholder={props.placeholder ?? "Color"}
        aria-label={props.label}
        aria-invalid={!valid}
        spellCheck={false}
        onChange={(event) => {
          props.onChange(event.currentTarget.value, undefined, props.id);
        }}
        onFocus={(event) => {
          props.onFocus(props.id, event.currentTarget.value);
        }}
        onBlur={(event) => {
          props.onBlur(props.id, event.currentTarget.value);
        }}
      />
    </div>
  );
}
