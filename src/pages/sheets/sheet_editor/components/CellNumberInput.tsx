import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NumberInput from "../../../../components/number-input";

function CellNumberInput({
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
  const [num, setNum] = useState<number | "">(value === "" ? "" : Number(value));
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setStyle({
      position: "fixed",
      left: rect.left,
      width: Math.max(rect.width, 200),
      ...(below < 120 ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        cellRef.current &&
        !cellRef.current.contains(e.target as Node)
      ) {
        commitAndClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [num]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const commitAndClose = () => {
    const strVal = num === "" ? "" : String(num);
    if (strVal !== value) onCommit(strVal);
    onClose();
  };

  return (
    <div
      ref={cellRef}
      className="px-3 py-2 text-sm min-h-[2.25rem] flex items-center justify-end font-mono tabular-nums bg-primary-600/5"
    >
      <span className="truncate">
        {value !== "" ? value : <span className="text-support-700">&mdash;</span>}
      </span>
      {createPortal(
        <div
          ref={popRef}
          style={style}
          className="z-[200] bg-dark-900 border border-border-main rounded-lg shadow-[0_2px_6px_0_rgba(0,0,0,0.15),0_8px_24px_0_rgba(0,0,0,0.3)] p-3"
        >
          <NumberInput
            size="sm"
            value={num}
            onChange={setNum}
            allowNegative
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") commitAndClose();
            }}
          />
          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border-subtle">
            {value && (
              <button
                type="button"
                className="text-xs text-support-500 hover:text-support-300 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-hover-strong"
                onClick={() => {
                  onCommit("");
                  onClose();
                }}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-hover-strong"
              onClick={commitAndClose}
            >
              Done
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default CellNumberInput;
