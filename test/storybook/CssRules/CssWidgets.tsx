import type { WidgetProps } from "@rjsf/utils";

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

const inputClassName =
  "css-value-control border-input placeholder:text-muted-foreground bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";

export function CssColorWidget({
  id,
  value,
  disabled,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) {
  return (
    <input
      id={id}
      type="text"
      value={getStringValue(value)}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder="#000000, rgb(...), var(...)"
      className={`${inputClassName} css-color-control`}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur(id, event.target.value)}
      onFocus={(event) => onFocus(id, event.target.value)}
    />
  );
}

export function CssLengthWidget({
  id,
  value,
  disabled,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={getStringValue(value)}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder="0, 16px, 100%, calc(...)"
      className={inputClassName}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur(id, event.target.value)}
      onFocus={(event) => onFocus(id, event.target.value)}
    />
  );
}

export function CssNumberWidget({
  id,
  value,
  disabled,
  readonly,
  required,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={getStringValue(value)}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      placeholder="0"
      className={inputClassName}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur(id, event.target.value)}
      onFocus={(event) => onFocus(id, event.target.value)}
    />
  );
}

export const cssWidgets = {
  CssColorWidget,
  CssLengthWidget,
  CssNumberWidget,
};
