import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
} from "react";
import {
  IconMinus,
  IconPlus,
  IconAlertCircle,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NumberInputSize = "sm" | "md" | "lg";
export type NumberInputVariant =
  | "outlined"
  | "filled"
  | "stepper"
  | "compact"
  | "unstyled";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange" | "value" | "defaultValue"
  > {
  size?: NumberInputSize;
  variant?: NumberInputVariant;
  value?: number | "";
  defaultValue?: number;
  onChange?: (value: number | "") => void;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
  hideControls?: boolean;
  clampOnBlur?: boolean;
  allowNegative?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_CONFIG = {
  sm: {
    height: "h-10",
    text: "text-sm",
    label: "text-xs",
    iconSize: 14,
    btnSize: "w-7 h-7",
    compactBtn: "w-8 h-5",
  },
  md: {
    height: "h-14",
    text: "text-sm",
    label: "text-xs",
    iconSize: 16,
    btnSize: "w-8 h-8",
    compactBtn: "w-9 h-6",
  },
  lg: {
    height: "h-16",
    text: "text-base",
    label: "text-xs",
    iconSize: 18,
    btnSize: "w-9 h-9",
    compactBtn: "w-10 h-7",
  },
} as const;

const HOLD_DELAY = 400;
const HOLD_INTERVAL = 60;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      size = "md",
      variant = "outlined",
      value,
      defaultValue,
      onChange,
      label,
      helperText,
      error,
      success,
      disabled,
      fullWidth = true,
      min,
      max,
      step = 1,
      precision,
      prefix,
      suffix,
      loading,
      hideControls = false,
      clampOnBlur = true,
      allowNegative = true,
      wrapperClassName,
      inputClassName,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fieldId = useId();
    const holdTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const holdIntervalRef = useRef<ReturnType<typeof setInterval>>(null);

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number | "">(
      value ?? defaultValue ?? "",
    );
    const [focused, setFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState("");

    const currentValue = isControlled ? value : internalValue;

    const resolvedPrecision =
      precision ?? (String(step).includes(".") ? String(step).split(".")[1].length : 0);

    const formatDisplay = useCallback(
      (val: number | "") => {
        if (val === "") return "";
        const formatted = resolvedPrecision > 0 ? val.toFixed(resolvedPrecision) : String(val);
        return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
      },
      [resolvedPrecision, prefix, suffix],
    );

    useEffect(() => {
      if (isControlled) setInternalValue(value);
    }, [value, isControlled]);

    useEffect(() => {
      if (!focused) {
        setDisplayValue(formatDisplay(currentValue));
      }
    }, [currentValue, focused, formatDisplay]);

    const clamp = useCallback(
      (val: number) => {
        let clamped = val;
        if (!allowNegative && clamped < 0) clamped = 0;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        if (resolvedPrecision > 0) {
          clamped = parseFloat(clamped.toFixed(resolvedPrecision));
        }
        return clamped;
      },
      [min, max, allowNegative, resolvedPrecision],
    );

    const setValue = useCallback(
      (next: number | "") => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const increment = useCallback(() => {
      const base = currentValue === "" ? 0 : currentValue;
      const next = clamp(parseFloat((base + step).toFixed(10)));
      if (max !== undefined && next > max) return;
      setValue(next);
    }, [currentValue, step, clamp, max, setValue]);

    const decrement = useCallback(() => {
      const base = currentValue === "" ? 0 : currentValue;
      const next = clamp(parseFloat((base - step).toFixed(10)));
      if (min !== undefined && next < min) return;
      setValue(next);
    }, [currentValue, step, clamp, min, setValue]);

    const startHold = useCallback(
      (action: () => void) => {
        action();
        holdTimerRef.current = setTimeout(() => {
          holdIntervalRef.current = setInterval(action, HOLD_INTERVAL);
        }, HOLD_DELAY);
      },
      [],
    );

    const stopHold = useCallback(() => {
      clearTimeout(holdTimerRef.current);
      clearInterval(holdIntervalRef.current);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw);

      if (raw === "" || raw === "-") {
        setValue(raw === "-" ? currentValue : "");
        return;
      }

      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        setValue(parsed);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      const raw = currentValue === "" ? "" : String(currentValue);
      setDisplayValue(raw);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      if (clampOnBlur && currentValue !== "") {
        const clamped = clamp(currentValue as number);
        if (clamped !== currentValue) setValue(clamped);
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        increment();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        decrement();
      }
      props.onKeyDown?.(e);
    };

    const cfg = SIZE_CONFIG[size];

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

    const labelFloated = focused || currentValue !== "" || !!props.placeholder;

    const hasRight = !hideControls || !!error || !!success || loading;

    const canIncrement = max === undefined || (currentValue !== "" && currentValue < max);
    const canDecrement = min === undefined || (currentValue !== "" && currentValue > min);

    // -----------------------------------------------------------------------
    // Control button
    // -----------------------------------------------------------------------
    const ControlButton = ({
      action,
      icon,
      ariaLabel,
      isDisabled,
      className = "",
    }: {
      action: () => void;
      icon: React.ReactNode;
      ariaLabel: string;
      isDisabled: boolean;
      className?: string;
    }) => (
      <button
        type="button"
        tabIndex={-1}
        aria-label={ariaLabel}
        disabled={disabled || isDisabled}
        onMouseDown={(e) => {
          e.preventDefault();
          if (!disabled && !isDisabled) startHold(action);
        }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => {
          e.preventDefault();
          if (!disabled && !isDisabled) startHold(action);
        }}
        onTouchEnd={stopHold}
        className={`
          flex items-center justify-center select-none
          transition-colors duration-150
          ${disabled || isDisabled
            ? "text-support-500/40 cursor-not-allowed"
            : "text-support-300 hover:text-support-100 hover:bg-support-600/15 active:bg-support-600/25"
          }
          ${className}
        `}
      >
        {icon}
      </button>
    );

    // -----------------------------------------------------------------------
    // Variant: stepper — side-by-side buttons flanking the value
    // -----------------------------------------------------------------------
    if (variant === "stepper") {
      return (
        <div
          className={`${fullWidth ? "w-full" : "inline-flex"} ${wrapperClassName ?? ""}`}
        >
          {label && (
            <label
              htmlFor={fieldId}
              className={`block mb-1.5 ${cfg.label} font-medium ${stateColor}`}
            >
              {label}
            </label>
          )}
          <div
            className={`
              inline-flex items-center ${cfg.height} rounded-lg
              ${borderWidth} ${borderColor}
              ${disabled ? "opacity-50 pointer-events-none" : ""}
              transition-[border-color] duration-200
            `}
          >
            <ControlButton
              action={decrement}
              icon={<IconMinus size={cfg.iconSize} />}
              ariaLabel="Decrease value"
              isDisabled={!canDecrement}
              className={`${cfg.btnSize} rounded-l-lg border-r border-support-400/20`}
            />
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              id={fieldId}
              type="text"
              inputMode="decimal"
              value={displayValue}
              disabled={disabled}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`
                w-20 h-full bg-transparent outline-none text-center
                ${cfg.text} text-support-100
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
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue === "" ? undefined : currentValue}
              role="spinbutton"
              {...props}
            />
            <ControlButton
              action={increment}
              icon={<IconPlus size={cfg.iconSize} />}
              ariaLabel="Increase value"
              isDisabled={!canIncrement}
              className={`${cfg.btnSize} rounded-r-lg border-l border-support-400/20`}
            />
          </div>
          {(error || helperText) && (
            <p
              id={error ? `${fieldId}-error` : `${fieldId}-helper`}
              role={error ? "alert" : undefined}
              className={`mt-1 text-xs leading-4 ${
                error ? "text-danger-500" : "text-support-500"
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // Variant: compact — stacked up/down chevrons on the right
    // -----------------------------------------------------------------------
    if (variant === "compact") {
      return (
        <div
          className={`relative ${fullWidth ? "w-full" : ""} ${wrapperClassName ?? ""}`}
        >
          {label && (
            <label
              htmlFor={fieldId}
              className={`block mb-1.5 ${cfg.label} font-medium ${stateColor}`}
            >
              {label}
            </label>
          )}
          <div
            className={`
              relative flex items-center ${cfg.height} rounded-lg
              ${borderWidth} ${borderColor}
              ${disabled ? "opacity-50 pointer-events-none" : ""}
              transition-[border-color] duration-200
            `}
          >
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              id={fieldId}
              type="text"
              inputMode="decimal"
              value={displayValue}
              disabled={disabled}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`
                w-full h-full bg-transparent outline-none
                pl-4 pr-10
                ${cfg.text} text-support-100
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
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue === "" ? undefined : currentValue}
              role="spinbutton"
              {...props}
            />
            <div className="absolute right-1 inset-y-0 flex flex-col items-center justify-center gap-0.5">
              <ControlButton
                action={increment}
                icon={<IconPlus size={cfg.iconSize - 4} strokeWidth={2.5} />}
                ariaLabel="Increase value"
                isDisabled={!canIncrement}
                className={`${cfg.compactBtn} rounded-md`}
              />
              <ControlButton
                action={decrement}
                icon={<IconMinus size={cfg.iconSize - 4} strokeWidth={2.5} />}
                ariaLabel="Decrease value"
                isDisabled={!canDecrement}
                className={`${cfg.compactBtn} rounded-md`}
              />
            </div>
          </div>
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
    }

    // -----------------------------------------------------------------------
    // Variant: unstyled — bare input, no chrome
    // -----------------------------------------------------------------------
    if (variant === "unstyled") {
      return (
        <div
          className={`${fullWidth ? "w-full" : "inline-flex"} ${wrapperClassName ?? ""}`}
        >
          {label && (
            <label
              htmlFor={fieldId}
              className={`block mb-1.5 ${cfg.label} font-medium ${stateColor}`}
            >
              {label}
            </label>
          )}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={fieldId}
            type="text"
            inputMode="decimal"
            value={displayValue}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`
              w-full bg-transparent outline-none
              ${cfg.text} text-support-100
              ${disabled ? "opacity-50 pointer-events-none" : ""}
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
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue === "" ? undefined : currentValue}
            role="spinbutton"
            {...props}
          />
          {(error || helperText) && (
            <p
              id={error ? `${fieldId}-error` : `${fieldId}-helper`}
              role={error ? "alert" : undefined}
              className={`mt-1 text-xs leading-4 ${
                error ? "text-danger-500" : "text-support-500"
              }`}
            >
              {error || helperText}
            </p>
          )}
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // Variants: outlined / filled — MD3-style floating label with +/- buttons
    // -----------------------------------------------------------------------
    return (
      <div
        className={`relative ${fullWidth ? "w-full" : ""} ${wrapperClassName ?? ""}`}
      >
        <div
          className={`
            relative ${cfg.height} rounded-lg
            ${variant === "filled" ? "bg-support-800/10 rounded-t-lg rounded-b-none border-b-2 border-t-0 border-x-0" : ""}
            ${variant === "outlined" ? `${borderWidth} ${borderColor}` : ""}
            ${disabled ? "opacity-50 pointer-events-none" : ""}
            transition-[border-color] duration-200
            [transition-timing-function:cubic-bezier(0.2,0,0,1)]
          `}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={fieldId}
            type="text"
            inputMode="decimal"
            value={displayValue}
            disabled={disabled}
            placeholder={labelFloated ? props.placeholder : undefined}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`
              peer w-full h-full bg-transparent outline-none
              ${cfg.text}
              pl-4
              ${hasRight ? "pr-24" : "pr-4"}
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
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue === "" ? undefined : currentValue}
            role="spinbutton"
            {...props}
          />

          {label && (
            <label
              htmlFor={fieldId}
              className={`
                absolute pointer-events-none select-none
                transition-all duration-200
                [transition-timing-function:cubic-bezier(0.2,0,0,1)]
                left-4
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
              {!hideControls && (
                <>
                  <ControlButton
                    action={decrement}
                    icon={<IconMinus size={cfg.iconSize} />}
                    ariaLabel="Decrease value"
                    isDisabled={!canDecrement}
                    className={`${cfg.btnSize} rounded-lg`}
                  />
                  <ControlButton
                    action={increment}
                    icon={<IconPlus size={cfg.iconSize} />}
                    ariaLabel="Increase value"
                    isDisabled={!canIncrement}
                    className={`${cfg.btnSize} rounded-lg`}
                  />
                </>
              )}
            </div>
          )}
        </div>

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

NumberInput.displayName = "NumberInput";
export default NumberInput;
