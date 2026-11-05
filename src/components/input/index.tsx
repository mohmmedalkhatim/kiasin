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

const SIZE = {
  sm: { height: "h-9", text: "text-sm", label: "text-[11px]", icon: 16 },
  md: { height: "h-10", text: "text-sm", label: "text-[11px]", icon: 18 },
  lg: { height: "h-12", text: "text-base", label: "text-xs", icon: 20 },
} as const;

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

    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");
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

    const cfg = SIZE[size];

    const defaultLeftIcon = useMemo(() => {
      if (leftSection) return leftSection;
      if (type === "email") return <IconMail size={cfg.icon} />;
      if (type === "password") return <IconLock size={cfg.icon} />;
      if (type === "search") return <IconSearch size={cfg.icon} />;
      if (type === "tel") return <IconPhone size={cfg.icon} />;
      return null;
    }, [type, leftSection, cfg.icon]);

    const hasLeft = !!defaultLeftIcon;
    const hasRight = !!rightSection || clearable || isPassword || loading || !!error || !!success;

    const borderClass = disabled
      ? "border-border-main opacity-50 pointer-events-none"
      : error
        ? "border-danger-500"
        : success
          ? "border-success-500"
          : focused
            ? "border-primary-600"
            : "border-border-main hover:border-border-strong";

    const labelColor = error
      ? "text-danger-500"
      : success
        ? "text-success-500"
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
            ${variant === "filled" ? "bg-hover-subtle" : ""}
            ${borderClass}
            transition-colors duration-150 cursor-text
          `}
          onClick={() => inputRef.current?.focus()}
        >
          {hasLeft && (
            <div className={`absolute left-3 inset-y-0 flex items-center ${focused ? "text-primary-500" : "text-support-500"} pointer-events-none transition-colors duration-150`}>
              {defaultLeftIcon}
            </div>
          )}

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
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className={`
              w-full h-full bg-transparent outline-none
              ${cfg.text} text-support-100
              ${hasLeft ? "pl-10" : "pl-3.5"}
              ${hasRight ? "pr-10" : "pr-3.5"}
              placeholder:text-support-500/50
              ${inputClassName ?? ""}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            {...props}
          />

          {hasRight && (
            <div className="absolute right-2 inset-y-0 flex items-center gap-1">
              {loading && <IconLoader2 className="animate-spin text-support-400" size={cfg.icon} />}
              {error && !loading && <IconAlertCircle size={cfg.icon} className="text-danger-500" />}
              {success && !error && !loading && <IconCheck size={cfg.icon} className="text-success-500" />}
              {clearable && hasValue && !loading && (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={handleClear}
                  className="p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
                >
                  <IconX size={cfg.icon - 2} />
                </button>
              )}
              {isPassword && (
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
                >
                  {showPassword ? <IconEyeOff size={cfg.icon} /> : <IconEye size={cfg.icon} />}
                </button>
              )}
              {rightSection}
            </div>
          )}
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

Input.displayName = "Input";
export default Input;
