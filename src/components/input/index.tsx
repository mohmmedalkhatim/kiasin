import React, { forwardRef, useState, useEffect, useRef, useMemo, useId } from "react";
import {
  IconX,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconLoader2,
  IconAlertCircle,
  IconCheck,
  IconMail,
  IconLock,
  IconPhone,
} from "@tabler/icons-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "outlined" | "filled";
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  variant?: InputVariant;
  type?: InputType;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  clearable?: boolean;
  loading?: boolean;
  withCount?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  onClear?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_CONFIG = {
  sm: { height: "h-10", text: "text-sm", label: "text-xs", iconSize: 16 },
  md: { height: "h-14", text: "text-sm", label: "text-xs", iconSize: 18 },
  lg: { height: "h-16", text: "text-base", label: "text-xs", iconSize: 20 },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "outlined",
      type = "text",
      label,
      helperText,
      error,
      success,
      disabled,
      fullWidth = true,
      leftSection,
      rightSection,
      clearable,
      loading,
      wrapperClassName,
      inputClassName,
      value,
      defaultValue,
      placeholder,
      onChange,
      onClear,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fieldId = useId();

    const [internalValue, setInternalValue] = useState(
      value ?? defaultValue ?? "",
    );
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = String(currentValue).length > 0;
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    useEffect(() => {
      if (isControlled) setInternalValue(String(value ?? ""));
    }, [value, isControlled]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      onClear?.();
      inputRef.current?.focus();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const cfg = SIZE_CONFIG[size];

    const defaultLeftIcon = useMemo(() => {
      if (leftSection) return leftSection;
      if (type === "email") return <IconMail size={cfg.iconSize} />;
      if (type === "password") return <IconLock size={cfg.iconSize} />;
      if (type === "search") return <IconSearch size={cfg.iconSize} />;
      if (type === "tel") return <IconPhone size={cfg.iconSize} />;
      return null;
    }, [type, leftSection, cfg.iconSize]);

    const hasLeft = !!defaultLeftIcon;
    const hasRight =
      !!rightSection || clearable || isPassword || loading || !!error || !!success;

    // MD3 state colors
    const stateColor = disabled
      ? "text-support-500"
      : error
        ? "text-danger-500"
        : success
          ? "text-success-500"
          : focused
            ? "text-primary-600"
            : "text-support-500";

    const borderColor = disabled
      ? "border-support-400/20"
      : error
        ? "border-danger-500"
        : success
          ? "border-success-500"
          : focused
            ? "border-primary-600"
            : "border-support-400/40 hover:border-support-300";

    const borderWidth = focused || error ? "border-2" : "border";

    const labelFloated = focused || hasValue || !!placeholder;

    return (
      <div
        className={`relative ${fullWidth ? "w-full" : ""} ${wrapperClassName ?? ""}`}
      >
        {/* Field container */}
        <div
          className={`
            relative ${cfg.height} rounded-[4px]
            ${variant === "filled" ? "bg-support-800/10 rounded-t-[4px] rounded-b-none border-b-2 border-t-0 border-x-0" : ""}
            ${variant === "outlined" ? `${borderWidth} ${borderColor}` : ""}
            ${disabled ? "opacity-50 pointer-events-none" : ""}
            transition-[border-color] duration-200
            [transition-timing-function:cubic-bezier(0.2,0,0,1)]
            cursor-text
          `}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Left section */}
          {hasLeft && (
            <div
              className={`absolute left-3 inset-y-0 flex items-center ${stateColor} pointer-events-none`}
            >
              {defaultLeftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={fieldId}
            type={resolvedType}
            value={currentValue}
            disabled={disabled}
            placeholder={labelFloated ? placeholder : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              peer w-full h-full bg-transparent outline-none
              ${cfg.text}
              ${hasLeft ? "pl-11" : "pl-4"}
              ${hasRight ? "pr-11" : "pr-4"}
              ${label ? "pt-5 pb-1" : ""}
              text-support-100
              placeholder:text-support-500/60
              ${inputClassName ?? ""}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                  ? `${fieldId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Floating label (MD3 outlined style) */}
          {label && (
            <label
              htmlFor={fieldId}
              className={`
                absolute pointer-events-none select-none
                transition-all duration-200
                [transition-timing-function:cubic-bezier(0.2,0,0,1)]
                ${hasLeft ? "left-11" : "left-4"}
                ${stateColor}
                ${
                  labelFloated
                    ? `top-1.5 ${cfg.label} font-medium`
                    : `top-1/2 -translate-y-1/2 ${cfg.text}`
                }
              `}
            >
              {label}
            </label>
          )}

          {/* Right section */}
          {hasRight && (
            <div className="absolute right-2 inset-y-0 flex items-center gap-1">
              {loading && (
                <IconLoader2
                  className="animate-spin text-support-400"
                  size={cfg.iconSize}
                />
              )}
              {error && !loading && (
                <IconAlertCircle
                  size={cfg.iconSize}
                  className="text-danger-500"
                />
              )}
              {success && !error && !loading && (
                <IconCheck
                  size={cfg.iconSize}
                  className="text-success-500"
                />
              )}
              {clearable && hasValue && !loading && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="p-1 rounded-full text-support-400 hover:text-support-200 hover:bg-support-600/10 transition-colors"
                >
                  <IconX size={cfg.iconSize - 2} />
                </button>
              )}
              {isPassword && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="p-1 rounded-full text-support-400 hover:text-support-200 hover:bg-support-600/10 transition-colors"
                >
                  {showPassword ? (
                    <IconEyeOff size={cfg.iconSize} />
                  ) : (
                    <IconEye size={cfg.iconSize} />
                  )}
                </button>
              )}
              {rightSection}
            </div>
          )}
        </div>

        {/* Helper / error text (MD3: body-small, 16px left padding) */}
        {(error || helperText) && (
          <p
            id={error ? `${fieldId}-error` : `${fieldId}-helper`}
            role={error ? "alert" : undefined}
            className={`mt-1 px-4 text-xs leading-4 ${
              error ? "text-danger-500" : "text-support-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
