import { forwardRef, useState, useId } from "react";

export type NativeSelectSize = "sm" | "md" | "lg";

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: NativeSelectSize;
  options: NativeSelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  wrapperClassName?: string;
}

const SIZE = {
  sm: { height: "h-9", text: "text-sm", label: "text-[11px]", chevron: 14 },
  md: { height: "h-10", text: "text-sm", label: "text-[11px]", chevron: 16 },
  lg: { height: "h-12", text: "text-base", label: "text-xs", chevron: 18 },
} as const;

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      size = "md",
      options,
      label,
      placeholder,
      error,
      helperText,
      disabled,
      fullWidth = true,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref,
  ) => {
    const fieldId = useId();
    const [focused, setFocused] = useState(false);
    const cfg = SIZE[size];

    const borderClass = disabled
      ? "border-border-main opacity-50 pointer-events-none"
      : error
        ? "border-danger-500"
        : focused
          ? "border-primary-600"
          : "border-border-main hover:border-border-strong";

    const labelColor = error
      ? "text-danger-500"
      : focused
        ? "text-primary-500"
        : "text-support-400";

    return (
      <div className={`relative ${fullWidth ? "w-full" : ""} ${wrapperClassName ?? ""}`}>
        {label && (
          <label
            htmlFor={fieldId}
            className={`
              absolute -top-2 left-3 px-1 bg-dark-900 z-[1]
              ${cfg.label} font-medium ${labelColor}
              transition-colors duration-150
            `}
          >
            {label}
          </label>
        )}

        <div
          className={`
            relative ${cfg.height} rounded-lg border
            ${borderClass}
            transition-colors duration-150 cursor-pointer
          `}
        >
          <select
            ref={ref}
            id={fieldId}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={onChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            className={`
              w-full h-full bg-transparent outline-none appearance-none
              ${cfg.text} text-support-100
              pl-3.5 pr-10 cursor-pointer
              ${className ?? ""}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
            <svg
              width={cfg.chevron}
              height={cfg.chevron}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={`transition-colors duration-150 ${focused ? "text-primary-500" : "text-support-400"}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {(error || helperText) && (
          <p
            id={error ? `${fieldId}-error` : `${fieldId}-helper`}
            role={error ? "alert" : undefined}
            className={`mt-1.5 px-3.5 text-xs leading-4 ${error ? "text-danger-500" : "text-support-500"}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

NativeSelect.displayName = "NativeSelect";
export default NativeSelect;
