import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { DAYS, MONTHS, parseDateStr, fmtDate } from "../utils";

function CellDatePicker({
  value,
  onCommit,
  onClose,
}: {
  value: string;
  onCommit: (v: string) => void;
  onClose: () => void;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const selected = parseDateStr(value);
  const now = new Date();
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? now.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? now.getMonth());
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setStyle({
      position: "fixed",
      left: rect.left,
      width: 280,
      ...(below < 320 ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        cellRef.current &&
        !cellRef.current.contains(e.target as Node)
      )
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = (() => {
    const d = new Date(viewYear, viewMonth, 1).getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleSelect = (day: number) => {
    onCommit(fmtDate(new Date(viewYear, viewMonth, day)));
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div
      ref={cellRef}
      className="px-3 py-2 text-sm min-h-[2.25rem] flex items-center bg-primary-600/5"
    >
      <span className="truncate flex-1">
        {value ? value : <span className="text-support-700">&mdash;</span>}
      </span>
      {createPortal(
        <div
          ref={popRef}
          style={style}
          className="z-[200] bg-dark-900 border border-border-main rounded-lg shadow-[0_2px_6px_0_rgba(0,0,0,0.15),0_8px_24px_0_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-main">
            <button
              type="button"
              className="p-1.5 rounded-md text-support-400 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
              onClick={prevMonth}
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
            >
              <IconChevronRight size={16} />
            </button>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-center h-8 text-[11px] font-medium text-support-500"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} className="h-8" />;
                const date = new Date(viewYear, viewMonth, day);
                const isSelected = selected && isSameDay(date, selected);
                const isToday = isSameDay(date, now);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={`flex items-center justify-center h-8 w-8 mx-auto rounded-md text-sm transition-colors duration-100 cursor-pointer ${isSelected
                      ? "bg-primary-800 text-white font-medium"
                      : isToday
                        ? "text-primary-400 font-medium hover:bg-hover-strong"
                        : "text-support-200 hover:bg-hover-strong"
                      }`}
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
                onClick={() => handleSelect(now.getDate())}
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  className="text-xs text-support-500 hover:text-support-300 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-hover-strong"
                  onClick={() => onCommit("")}
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

export default CellDatePicker;
