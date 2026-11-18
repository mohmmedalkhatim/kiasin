import { useEffect, useRef, useState } from "react";
import { IconCalendar } from "@tabler/icons-react";
import { ColumnType } from "../types";
import { validateCell } from "../utils";
import CellDatePicker from "./CellDatePicker";
import CellNumberInput from "./CellNumberInput";

function EditableCell({
  value,
  colType,
  onCommit,
}: {
  value: any;
  colType: ColumnType;
  onCommit: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const err = validateCell(draft, colType);
    if (err) {
      setError(err);
      return;
    }
    if (draft !== String(value ?? "")) onCommit(draft);
    setEditing(false);
    setError(null);
  };

  const cancel = () => {
    setDraft(String(value ?? ""));
    setEditing(false);
    setError(null);
  };

  if (!editing) {
    return (
      <div
        className={`px-3 py-2 text-sm truncate cursor-text min-h-[2.25rem] select-none group/cell relative hover:bg-dark-800/30 transition-colors flex items-center ${colType === "number" ? "justify-end font-mono tabular-nums" : ""}`}
        onDoubleClick={() => {
          setDraft(String(value ?? ""));
          setEditing(true);
        }}
      >
        <span className={`truncate flex-1 ${colType === "number" ? "text-right font-mono" : ""}`}>
          {value !== undefined && value !== null && value !== "" ? (
            String(value)
          ) : (
            <span className="text-support-700">&mdash;</span>
          )}
        </span>
        {colType === "date" && (
          <button
            className="shrink-0 p-0.5 rounded text-support-600 hover:text-support-300 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setDraft(String(value ?? ""));
              setEditing(true);
            }}
          >
            <IconCalendar size={13} />
          </button>
        )}
      </div>
    );
  }

  if (colType === "date") {
    return (
      <CellDatePicker
        value={String(value ?? "")}
        onCommit={(val) => {
          if (val !== String(value ?? "")) onCommit(val);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  if (colType === "number") {
    return (
      <CellNumberInput
        value={String(value ?? "")}
        onCommit={(val) => {
          if (val !== String(value ?? "")) onCommit(val);
          setEditing(false);
        }}
        onClose={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={`w-full px-3 py-1.5 text-sm bg-dark-800 outline-none border ${error ? "border-danger-500" : "border-primary-600"}`}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        onBlur={commit}
      />
      {error && (
        <div className="absolute left-0 top-full mt-0.5 px-2 py-1 text-xs bg-danger-900 text-danger-200 rounded z-10 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}

export default EditableCell;
