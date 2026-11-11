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

export type NumberInputSize = "sm" | "md" | "lg";
export type NumberInputVariant = "outlined" | "filled";

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

const SIZE = {
  sm: { height: "h-8", text: "text-xs", label: "text-[10px]", icon: 12, btn: "w-5 h-5" },
  md: { height: "h-10", text: "text-sm", label: "text-[11px]", icon: 14, btn: "w-6 h-6" },
  lg: { height: "h-12", text: "text-base", label: "text-xs", icon: 16, btn: "w-7 h-7" },
} as const;

const HOLD_DELAY = 400;
const HOLD_INTERVAL = 60;

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
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
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

    const cfg = SIZE[size];

    const canIncrement = max === undefined || (currentValue !== "" && currentValue < max);
    const canDecrement = min === undefined || (currentValue !== "" && currentValue > min);

    const hasRight = !hideControls || !!error || !!success || loading;

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

    const ControlBtn = ({
      action,
      icon,
      ariaLabel,
      isDisabled,
    }: {
      action: () => void;
      icon: React.ReactNode;
      ariaLabel: string;
      isDisabled: boolean;
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
          flex items-center justify-center select-none rounded
          transition-all duration-100 cursor-pointer
          ${disabled || isDisabled
            ? "text-support-700 cursor-not-allowed"
            : "text-support-500 hover:text-support-200 hover:bg-hover-strong active:scale-90"
          }
          ${cfg.btn}
        `}
      >
        {icon}
      </button>
    );

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
            group/num relative ${cfg.height} rounded-lg border
            ${variant === "filled" ? "bg-hover-subtle" : ""}
            ${borderClass}
            transition-colors duration-150 cursor-text
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
            placeholder={props.placeholder}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`
              w-full h-full bg-transparent outline-none
              ${cfg.text} text-support-100
              pl-3.5
              ${hasRight ? "pr-14" : "pr-3.5"}
              placeholder:text-support-500
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

          <div className="absolute right-1 inset-y-0 flex items-center gap-px">
            {loading && (
              <IconLoader2 className="animate-spin text-support-400" size={cfg.icon} />
            )}
            {error && !loading && (
              <IconAlertCircle size={cfg.icon} className="text-danger-500" />
            )}
            {success && !error && !loading && (
              <IconCheck size={cfg.icon} className="text-success-500" />
            )}
            {!hideControls && (
              <div className="flex items-center gap-px opacity-0 group-hover/num:opacity-100 group-focus-within/num:opacity-100 transition-opacity duration-150">
                <ControlBtn
                  action={decrement}
                  icon={<IconMinus size={cfg.icon} />}
                  ariaLabel="Decrease"
                  isDisabled={!canDecrement}
                />
                <ControlBtn
                  action={increment}
                  icon={<IconPlus size={cfg.icon} />}
                  ariaLabel="Increase"
                  isDisabled={!canIncrement}
                />
              </div>
            )}
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

NumberInput.displayName = "NumberInput";
export default NumberInput;
