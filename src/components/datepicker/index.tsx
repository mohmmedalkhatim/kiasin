import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerProps {
  size?: DatePickerSize;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  min?: string;
  max?: string;
  clearable?: boolean;
  wrapperClassName?: string;
}

const SIZE = {
  sm: { height: "h-9", text: "text-sm", label: "text-[11px]", icon: 16 },
  md: { height: "h-10", text: "text-sm", label: "text-[11px]", icon: 18 },
  lg: { height: "h-12", text: "text-base", label: "text-xs", icon: 20 },
} as const;

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, min?: string, max?: string): boolean {
  if (min) {
    const minD = parseDate(min);
    if (minD && date < minD) return false;
  }
  if (max) {
    const maxD = parseDate(max);
    if (maxD && date > maxD) return false;
  }
  return true;
}

export default function DatePicker({
  size = "md",
  value = "",
  onChange,
  label,
  placeholder = "Select date",
  error,
  helperText,
  disabled,
  fullWidth = true,
  min,
  max,
  clearable,
  wrapperClassName,
}: DatePickerProps) {
  const fieldId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const selected = parseDate(value);
  const now = new Date();

  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? now.getMonth());

  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [value]);

  const positionDropdown = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < 340 && rect.top > 340;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: Math.max(rect.width, 280),
      ...(above
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
      zIndex: 100,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    positionDropdown();

    const onScroll = () => positionDropdown();
    const onResize = () => positionDropdown();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    const onClick = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, positionDropdown]);

  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      setOpen(true);
      setFocused(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    if (!isInRange(date, min, max)) return;
    onChange?.(formatDate(date));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  const cfg = SIZE[size];

  const borderClass = disabled
    ? "border-border-main opacity-50 pointer-events-none"
    : error
      ? "border-danger-500"
      : focused && open
        ? "border-primary-600"
        : "border-border-main hover:border-border-strong";

  const labelColor = error
    ? "text-danger-500"
    : focused && open
      ? "text-primary-500"
      : "text-support-400";

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

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
        ref={triggerRef}
        id={fieldId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-invalid={!!error}
        tabIndex={disabled ? -1 : 0}
        className={`
          relative ${cfg.height} rounded-lg border
          ${borderClass}
          transition-colors duration-150 cursor-pointer select-none
          flex items-center
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!open) setFocused(false); }}
      >
        <div className={`absolute left-3 inset-y-0 flex items-center ${focused && open ? "text-primary-500" : "text-support-500"} pointer-events-none transition-colors duration-150`}>
          <IconCalendar size={cfg.icon} />
        </div>

        <span className={`flex-1 pl-10 pr-10 ${cfg.text} truncate ${value ? "text-support-100" : "text-support-500/50"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>

        {clearable && value && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={handleClear}
            className="absolute right-2 inset-y-0 flex items-center p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
          >
            <IconX size={cfg.icon - 2} />
          </button>
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

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-dark-900 border border-border-main rounded-lg shadow-[0_2px_6px_0_rgba(0,0,0,0.15),0_8px_24px_0_rgba(0,0,0,0.3)] overflow-hidden"
          role="dialog"
          aria-label="Choose date"
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-main">
            <button
              type="button"
              className="p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <IconChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-support-100">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <IconChevronRight size={16} />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="flex items-center justify-center h-8 text-[11px] font-medium text-support-500">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                if (day === null) {
                  return <div key={`e-${i}`} className="h-8" />;
                }

                const date = new Date(viewYear, viewMonth, day);
                const isSelected = selected && isSameDay(date, selected);
                const isToday = isSameDay(date, now);
                const inRange = isInRange(date, min, max);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!inRange}
                    onClick={() => handleSelect(day)}
                    className={`
                      flex items-center justify-center h-8 w-8 mx-auto rounded-md text-sm
                      transition-colors duration-100 cursor-pointer
                      ${isSelected
                        ? "bg-primary-800 text-white font-medium"
                        : isToday
                          ? "text-primary-400 font-medium hover:bg-hover-strong"
                          : inRange
                            ? "text-support-200 hover:bg-hover-strong"
                            : "text-support-600 cursor-not-allowed"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-hover-strong"
                onClick={() => {
                  const today = new Date();
                  onChange?.(formatDate(today));
                  setOpen(false);
                }}
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  className="text-xs text-support-400 hover:text-support-200 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-hover-strong"
                  onClick={() => {
                    onChange?.("");
                    setOpen(false);
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
