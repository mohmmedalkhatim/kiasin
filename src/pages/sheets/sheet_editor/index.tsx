import { RootState } from "../../../contexts/store";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as exceljs from "exceljs";
import { useAsync } from "react-use";
import Header from "../../../components/header";
import HeaderAction from "../../dashboard/Header/action";
import {
  IconRowInsertTop,
  IconTableColumn,
  IconTable,
  IconTrash,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX,
  IconCheck,
  IconGripVertical,
  IconMathFunction,
  IconBookmark,
  IconAlertTriangle,
  IconPin,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconSettings,
} from "@tabler/icons-react";
import { Sheet, SheetDTO } from "../../../contexts/sheets/objects";
import CreateTableDialog from "../sheets_list/create_table_dialog";
import { update_sheet } from "../../../contexts/sheets/functions/update";
import { Dialog } from "../../../components/Dialog";
import Button from "../../../components/Button";
import Input from "../../../components/input";
import NumberInput from "../../../components/number-input";
import NativeSelect from "../../../components/native-select";
import DatePicker from "../../../components/datepicker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../contexts/store";
import {
  ExcelFunction,
  EXCEL_FUNCTIONS,
  ColumnFunctionEntry,
  SavedCustomFunction,
  loadColumnFunctions,
  saveColumnFunctions,
  loadCustomFunctionLibrary,
  saveCustomFunctionLibrary,
  computeColumnResult,
  validateExpression,
} from "../../../contexts/sheets/column_functions";
import { Buffer } from "buffer";

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function colLetterToIndex(letters: string): number {
  let n = 0;
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n;
}

const loadTableFromSheet = async (
  active: Sheet | null,
  setTable: Dispatch<SetStateAction<exceljs.Table | null>>,
  setRowsCount: Dispatch<SetStateAction<number>>,
) => {
  if (!active?.file || !active.name) return;
  try {
    const workbook = new exceljs.Workbook();
    // @ts-ignore
    const ws = (await workbook.xlsx.load(active.file)).worksheets[0];
    const object = ws.getTable(active.name);
    // @ts-ignore
    const tableDef = object.table as exceljs.Table;
    const numCols = tableDef.columns.length;

    const refMatch = (tableDef.ref ?? "A1").match(/([A-Z]+)(\d+)/i);
    const startCol = refMatch ? colLetterToIndex(refMatch[1]) : 1;
    const headerRow = refMatch ? parseInt(refMatch[2]) : 1;
    const dataStartRow = headerRow + 1;

    const rows: any[][] = [];
    ws.eachRow((row, rowNumber) => {
      if (rowNumber < dataStartRow) return;
      const cells: any[] = [];
      for (let i = 0; i < numCols; i++) {
        cells.push(row.getCell(startCol + i).value);
      }
      if (cells.some((c) => c !== null && c !== undefined)) {
        rows.push(cells);
      }
    });

    const table = {
      name: tableDef.name,
      ref: tableDef.ref ?? "A1",
      columns: tableDef.columns.map((c) => ({ name: c.name, filterButton: c.filterButton })),
      rows,
    } as exceljs.Table;

    setTable(table);
    setRowsCount(rows.length);
  } catch (error) {
    console.error(error);
  }
};

function buildDescriptionFromTable(
  table: exceljs.Table,
  existingDesc: string | undefined,
  typeHints?: Record<string, string>,
): string {
  const existing = existingDesc ? parseDescriptionColumns(existingDesc) : [];
  const byName = new Map(existing.map((c) => [c.name, c]));

  const cols = table.columns.map((col, i) => {
    const prev = byName.get(col.name);
    if (prev) return prev;
    const type = typeHints?.[col.name] ?? inferColumnType(table, i);
    return { name: col.name, type };
  });
  return JSON.stringify(cols);
}

function inferColumnType(table: exceljs.Table, colIdx: number): string {
  if (!table.rows?.length) return "string";
  const sample = table.rows.find((r) => r[colIdx] != null && r[colIdx] !== "")?.[colIdx];
  if (sample == null) return "string";
  if (typeof sample === "number") return "number";
  if (typeof sample === "boolean") return "boolean";
  const str = String(sample);
  if (!Number.isNaN(Number(str)) && str.trim() !== "") return "number";
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return "date";
  return "string";
}

const persistTable = async (
  active: Sheet | null,
  table: exceljs.Table | null,
  dispatch: AppDispatch,
  typeHints?: Record<string, string>,
) => {
  if (!active?.name || !table) return;
  try {
    const freshWorkbook = new exceljs.Workbook();
    const freshSheet = freshWorkbook.addWorksheet();
    freshSheet.addTable({
      name: table.name,
      ref: table.ref ?? "A1",
      columns: table.columns.map((c) => ({ name: c.name, filterButton: c.filterButton })),
      rows: (table.rows ?? []).map((r) => [...r]),
    });

    const buffer = await freshWorkbook.xlsx.writeBuffer();
    const buf = Buffer.from(buffer);
    const description = buildDescriptionFromTable(table, active.description, typeHints);
    const descCols = parseDescriptionColumns(description);
    const existingInfo = active.rows_info ?? [];
    const rows_info = table.columns.map((col, i) => {
      const prev = existingInfo.find((r) => r.name === col.name);
      const type = descCols.find((c) => c.name === col.name)?.type ?? inferColumnType(table, i);
      return {
        id: prev?.id ?? 0,
        name: col.name,
        type,
        column_funotion: prev?.column_funotion,
      };
    });
    const dto: SheetDTO = {
      ...active,
      description,
      rows_info,
      file: buf.toString("base64"),
    };
    await dispatch(update_sheet(dto));
  } catch (error) {
    console.error(error);
  }
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type ColumnType = "string" | "number" | "date" | "boolean";

function validateCell(value: string, type: ColumnType): string | null {
  if (value === "") return null;
  switch (type) {
    case "number":
      return Number.isNaN(Number(value)) ? "Must be a number" : null;
    case "date":
      return Number.isNaN(Date.parse(value)) ? "Invalid date" : null;
    case "boolean":
      return ["true", "false", "1", "0", "yes", "no"].includes(value.toLowerCase())
        ? null
        : "Must be true or false";
    default:
      return null;
  }
}

function parseDescriptionColumns(desc: string): { name: string; type: string }[] {
  try {
    const parsed = JSON.parse(desc);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.columns && Array.isArray(parsed.columns)) return parsed.columns;
    return [];
  } catch {
    return [];
  }
}

function getColumnType(
  active: Sheet | null,
  colName: string,
  table?: exceljs.Table | null,
): ColumnType {
  if (active?.description) {
    const cols = parseDescriptionColumns(active.description);
    const col = cols.find((c) => c.name === colName);
    if (col?.type) return col.type as ColumnType;
  }
  if (active?.rows_info) {
    const info = active.rows_info.find((r) => r.name === colName);
    if (info?.type) return info.type as ColumnType;
  }
  if (table?.columns && table.rows?.length) {
    const colIdx = table.columns.findIndex((c) => c.name === colName);
    if (colIdx >= 0) {
      const sample = table.rows.find((r) => r[colIdx] != null && r[colIdx] !== "")?.[colIdx];
      if (sample != null) {
        if (typeof sample === "number") return "number";
        const str = String(sample);
        if (!Number.isNaN(Number(str)) && str.trim() !== "") return "number";
        if (/^\d{4}-\d{2}-\d{2}/.test(str)) return "date";
      }
    }
  }
  return "string";
}

// ---------------------------------------------------------------------------
// Sort
// ---------------------------------------------------------------------------

type SortDir = "asc" | "desc" | null;
type SortState = { column: number; dir: SortDir };
type IndexedRow = { cells: any[]; originalIndex: number };

function sortRows(rows: IndexedRow[], sort: SortState, colType: ColumnType): IndexedRow[] {
  if (sort.dir === null) return rows;
  const copy = [...rows];
  copy.sort((a, b) => {
    const av = a.cells[sort.column] ?? "";
    const bv = b.cells[sort.column] ?? "";
    let cmp: number;
    if (colType === "number") {
      cmp = (Number(av) || 0) - (Number(bv) || 0);
    } else if (colType === "date") {
      cmp = (Date.parse(String(av)) || 0) - (Date.parse(String(bv)) || 0);
    } else {
      cmp = String(av).localeCompare(String(bv));
    }
    return sort.dir === "desc" ? -cmp : cmp;
  });
  return copy;
}

// ---------------------------------------------------------------------------
// Cell date picker (calendar popover only)
// ---------------------------------------------------------------------------

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function fmtDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

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

// ---------------------------------------------------------------------------
// Cell number input (popover)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Editable cell
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Custom expression editor (per-column)
// ---------------------------------------------------------------------------

function CustomExpressionEditor({
  expr,
  columns,
  savedFns,
  onSave,
  onSaveToLibrary,
}: {
  expr: string;
  columns: { name: string }[];
  savedFns: SavedCustomFunction[];
  onSave: (expr: string) => void;
  onSaveToLibrary: (fn: SavedCustomFunction) => void;
}) {
  const [draft, setDraft] = useState(expr);
  const [error, setError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleApply = () => {
    const err = validateExpression(draft, columns);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onSave(draft);
  };

  const handleSaveToLibrary = () => {
    if (!saveName.trim() || !draft.trim()) return;
    onSaveToLibrary({ name: saveName.trim(), expr: draft.trim() });
    setSaveName("");
    setShowSaveForm(false);
  };

  return (
    <div className="flex flex-col gap-2 mt-1.5">
      <div className="relative">
        <input
          className={`w-full h-8 px-3 text-sm font-mono bg-dark-800 border rounded-md outline-none transition-colors ${error ? "border-danger-500" : "border-border-main focus:border-primary-600"
            }`}
          placeholder="e.g. sum(Price) * count(Qty)"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleApply();
          }}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1 text-xs text-danger-400">
            <IconAlertTriangle size={12} />
            {error}
          </div>
        )}
      </div>

      {/* Quick-insert column names */}
      <div className="flex flex-wrap gap-1">
        {columns.map((c) => (
          <button
            key={c.name}
            className="h-5 px-1.5 text-[10px] rounded border border-border-main text-support-400 hover:text-support-200 hover:border-support-500 transition-colors"
            onClick={() => setDraft((prev) => prev + c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Saved formulas quick-insert */}
      {savedFns.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {savedFns.map((fn) => (
            <button
              key={fn.name}
              className="h-5 px-1.5 text-[10px] rounded border border-primary-600/30 text-primary-400 hover:bg-primary-600/10 transition-colors"
              onClick={() => setDraft(fn.expr)}
              title={fn.expr}
            >
              <IconBookmark size={10} className="inline mr-0.5" />
              {fn.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <Button size="xs" onClick={handleApply}>
          Apply
        </Button>
        <Button size="xs" variant="text" onClick={() => setShowSaveForm((p) => !p)}>
          <IconBookmark size={14} />
          Save formula
        </Button>
      </div>

      {showSaveForm && (
        <div className="flex items-center gap-1.5">
          <input
            className="flex-1 h-7 px-2 text-xs bg-dark-800 border border-border-main rounded-md outline-none focus:border-primary-600"
            placeholder="Formula name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveToLibrary();
            }}
          />
          <Button size="xs" onClick={handleSaveToLibrary} disabled={!saveName.trim()}>
            Save
          </Button>
        </div>
      )}

      {/* Syntax help */}
      <div className="text-[10px] text-support-600 leading-relaxed">
        <span className="font-medium text-support-500">Aggregates:</span> sum, avg, min, max, count,
        median, stdev
        <br />
        <span className="font-medium text-support-500">Math:</span> abs, round, floor, ceil, +, -,
        *, /
        <br />
        <span className="font-medium text-support-500">Example:</span>{" "}
        <span className="font-mono">avg(Price) * count(Qty)</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function SheetEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { active } = useSelector((state: RootState) => state.database);
  const [table, setTable] = useState<exceljs.Table | null>(null);
  const [rowsCount, setRowsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const pendingSave = useRef(false);

  // Dialogs
  const [addRowOpen, setAddRowOpen] = useState(false);
  const [addColOpen, setAddColOpen] = useState(false);
  const [fnDialogOpen, setFnDialogOpen] = useState(false);
  const [editPropsOpen, setEditPropsOpen] = useState(false);
  const [tempRow, setTempRow] = useState<string[]>([]);
  const [tempCol, setTempCol] = useState({
    name: "",
    type: "string" as ColumnType,
  });
  const [rowErrors, setRowErrors] = useState<(string | null)[]>([]);

  // Column functions (persisted in Tauri Store)
  const [colFunctions, setColFunctions] = useState<Record<string, ColumnFunctionEntry>>({});

  // Saved custom formula library
  const [savedFormulas, setSavedFormulas] = useState<SavedCustomFunction[]>([]);

  // Search & sort
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ column: 0, dir: null });

  // Drag-and-drop reorder
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Column pinning
  const [pinnedCols, setPinnedCols] = useState<string[]>([]);

  // ---- persistence ----

  const saveTable = useCallback(
    async (nextTable: exceljs.Table | null, typeHints?: Record<string, string>) => {
      if (pendingSave.current) return;
      pendingSave.current = true;
      try {
        await persistTable(active, nextTable, dispatch, typeHints);
      } finally {
        pendingSave.current = false;
      }
    },
    [active, dispatch],
  );

  const applyAndSave = useCallback(
    (updater: (prev: exceljs.Table) => exceljs.Table, typeHints?: Record<string, string>) => {
      setTable((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        saveTable(next, typeHints);
        return next;
      });
    },
    [saveTable],
  );

  // ---- load ----

  useAsync(async () => {
    setLoading(true);
    setSort({ column: 0, dir: null });
    setSearch("");
    setColFunctions({});
    setPinnedCols([]);
    await loadTableFromSheet(active, setTable, setRowsCount);
    if (active?.name) {
      const saved = await loadColumnFunctions(active.name);
      setColFunctions(saved);
    }
    const lib = await loadCustomFunctionLibrary();
    setSavedFormulas(lib);
    setLoading(false);
  }, [active]);

  // ---- column function actions ----

  const setColumnFunction = useCallback(
    async (colName: string, fn: ExcelFunction, customExpr?: string) => {
      const entry: ColumnFunctionEntry = { fn, customExpr };
      const next = { ...colFunctions, [colName]: entry };
      setColFunctions(next);

      if (active?.name) {
        await saveColumnFunctions(active.name, next);
      }

      applyAndSave((prev) => ({
        ...prev,
        totalsRow: Object.values(next).some((e) => e.fn !== "none"),
        columns: prev.columns.map((col) => {
          const e = next[col.name];
          const hasFn = e && e.fn !== "none" && e.fn !== "custom";
          return {
            ...col,
            totalsRowFunction: hasFn ? e.fn : undefined,
          };
        }),
      }));
    },
    [colFunctions, active, applyAndSave],
  );

  const saveFormulaToLibrary = useCallback(
    async (fn: SavedCustomFunction) => {
      const exists = savedFormulas.findIndex((f) => f.name === fn.name);
      let next: SavedCustomFunction[];
      if (exists >= 0) {
        next = savedFormulas.map((f, i) => (i === exists ? fn : f));
      } else {
        next = [...savedFormulas, fn];
      }
      setSavedFormulas(next);
      await saveCustomFunctionLibrary(next);
    },
    [savedFormulas],
  );

  const deleteFormulaFromLibrary = useCallback(
    async (name: string) => {
      const next = savedFormulas.filter((f) => f.name !== name);
      setSavedFormulas(next);
      await saveCustomFunctionLibrary(next);
    },
    [savedFormulas],
  );

  // ---- row actions ----

  const addRow = useCallback(() => {
    if (!table) return;
    const errors = table.columns.map((col, i) =>
      validateCell(tempRow[i] ?? "", getColumnType(active, col.name, table)),
    );
    if (errors.some(Boolean)) {
      setRowErrors(errors);
      return;
    }
    applyAndSave((prev) => ({
      ...prev,
      rows: [...(prev.rows ?? []), [...tempRow]],
    }));
    setRowsCount((c) => c + 1);
    setTempRow([]);
    setRowErrors([]);
    setAddRowOpen(false);
  }, [tempRow, table, active, applyAndSave]);

  const deleteRow = useCallback(
    (rowIndex: number) => {
      applyAndSave((prev) => ({
        ...prev,
        rows: (prev.rows ?? []).filter((_, i) => i !== rowIndex),
      }));
      setRowsCount((c) => Math.max(0, c - 1));
    },
    [applyAndSave],
  );

  const updateCell = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      applyAndSave((prev) => {
        const rows = (prev.rows ?? []).map((r) => [...r]);
        if (rows[rowIndex]) rows[rowIndex][colIndex] = value;
        return { ...prev, rows };
      });
    },
    [applyAndSave],
  );

  // ---- column actions ----

  const addColumn = useCallback(() => {
    const name = tempCol.name.trim();
    if (!name) return;
    applyAndSave(
      (prev) => ({
        ...prev,
        columns: [...prev.columns, { name, filterButton: false }],
        rows: (prev.rows ?? []).map((r) => [...r, ""]),
      }),
      { [name]: tempCol.type },
    );
    setTempCol({ name: "", type: "string" });
    setAddColOpen(false);
  }, [tempCol, applyAndSave]);

  // ---- sort ----

  const toggleSort = useCallback((colIndex: number) => {
    setSort((prev) => {
      if (prev.column !== colIndex) return { column: colIndex, dir: "asc" };
      if (prev.dir === "asc") return { column: colIndex, dir: "desc" };
      if (prev.dir === "desc") return { column: colIndex, dir: null };
      return { column: colIndex, dir: "asc" };
    });
  }, []);

  // ---- drag reorder ----

  const canDrag = !search && sort.dir === null;

  const moveRow = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      applyAndSave((prev) => {
        const rows = [...(prev.rows ?? [])];
        const [moved] = rows.splice(from, 1);
        rows.splice(to, 0, moved);
        return { ...prev, rows };
      });
    },
    [applyAndSave],
  );

  const emptyImg = useRef<HTMLImageElement | null>(null);
  if (!emptyImg.current && typeof Image !== "undefined") {
    emptyImg.current = new Image();
    emptyImg.current.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  }

  const handleDragStart = useCallback((e: React.DragEvent, rowIndex: number) => {
    setDragFrom(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(rowIndex));
    if (emptyImg.current) e.dataTransfer.setDragImage(emptyImg.current, 0, 0);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.4";
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDragFrom(null);
    setDragOver(null);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, rowIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(rowIndex);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      if (dragFrom !== null && dragFrom !== toIndex) moveRow(dragFrom, toIndex);
      setDragFrom(null);
      setDragOver(null);
    },
    [dragFrom, moveRow],
  );

  // ---- column pinning ----

  const togglePin = useCallback((colName: string) => {
    setPinnedCols((prev) =>
      prev.includes(colName) ? prev.filter((n) => n !== colName) : [...prev, colName],
    );
  }, []);

  const displayOrder = useMemo(() => {
    if (!table?.columns) return [] as number[];
    const pinSet = new Set(pinnedCols);
    const pinned = pinnedCols
      .map((name) => table.columns.findIndex((c) => c.name === name))
      .filter((i) => i >= 0);
    const unpinned = table.columns
      .map((_, i) => i)
      .filter((i) => !pinSet.has(table.columns[i].name));
    return [...pinned, ...unpinned];
  }, [table?.columns, pinnedCols]);

  const hasPinned = pinnedCols.length > 0;
  const PIN_W = 192;
  const PRE_W = 76;

  const columnCount = table?.columns?.length ?? 0;
  const gridCols = useMemo(() => {
    if (!hasPinned || !table?.columns)
      return `28px 48px repeat(${columnCount}, minmax(8rem, 1fr)) 48px`;
    const sizes = displayOrder.map((i) =>
      pinnedCols.includes(table.columns[i].name) ? "12rem" : "minmax(8rem, 1fr)",
    );
    return `28px 48px ${sizes.join(" ")} 48px`;
  }, [hasPinned, columnCount, displayOrder, pinnedCols, table]);

  // ---- derived data ----

  const visibleRows = useMemo(() => {
    if (!table?.rows) return [];
    let rows: IndexedRow[] = table.rows.map((r, i) => ({
      cells: r,
      originalIndex: i,
    }));
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        r.cells.some((c) =>
          String(c ?? "")
            .toLowerCase()
            .includes(q),
        ),
      );
    }
    if (sort.dir !== null) {
      const colType = getColumnType(active, table.columns[sort.column]?.name ?? "", table);
      rows = sortRows(rows, sort, colType);
    }
    return rows;
  }, [table, search, sort, active]);

  const hasFunctions = useMemo(
    () => Object.values(colFunctions).some((e) => e.fn !== "none"),
    [colFunctions],
  );

  const totalsResults = useMemo(() => {
    if (!hasFunctions || !table?.columns || !table.rows) return [];
    return table.columns.map((col, i) => {
      const entry = colFunctions[col.name] ?? { fn: "none" as const };
      return computeColumnResult(table.rows ?? [], i, entry, table.columns);
    });
  }, [table, colFunctions, hasFunctions]);

  // ---- renders ----

  if (loading) {
    return (
      <main className="relative w-full">
        <Header className="!left-[calc(4.75rem+18rem)] !w-[calc(100vw-4.75rem-18rem)]">
          <div className="text-sm font-medium">{active?.name ?? "Sheet"}</div>
        </Header>
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-support-500">Loading sheet...</p>
        </div>
      </main>
    );
  }

  if (!table?.columns) {
    return (
      <main className="relative w-full">
        <Header className="!left-[calc(4.75rem+18rem)] !w-[calc(100vw-4.75rem-18rem)]">
          <div className="text-sm font-medium">{active?.name ?? "Sheet"}</div>
        </Header>
        <div className="pt-20 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="p-4 rounded-lg bg-hover-subtle border border-border-main">
            <IconTable size={28} className="text-support-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-support-500">No table data found</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header className="w-[calc(100vw-4.75rem)]">
        <div className="text-sm font-medium">{active?.name}</div>
        <div className="flex items-center gap-1">
          <HeaderAction description="Functions" onClick={() => setFnDialogOpen(true)}>
            <IconMathFunction size={18} stroke={1.5} />
          </HeaderAction>
          <HeaderAction description="Add column" onClick={() => setAddColOpen(true)}>
            <IconTableColumn size={18} stroke={1.5} />
          </HeaderAction>
          <HeaderAction
            description="Add row"
            onClick={() => {
              setTempRow([]);
              setRowErrors([]);
              setAddRowOpen(true);
            }}
          >
            <IconRowInsertTop size={18} stroke={1.5} />
          </HeaderAction>
          <div className="w-px h-5 bg-border-main mx-1" />
          <HeaderAction description="Table settings" onClick={() => setEditPropsOpen(true)}>
            <IconSettings size={18} stroke={1.5} />
          </HeaderAction>
        </div>
      </Header>

      <main className="w-full">
        <div className="pt-24 px-10 pb-6 flex flex-col min-h-[calc(100vh-2.5rem)]">
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="relative w-64">
              <IconSearch
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-support-600 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-8 text-xs bg-transparent border border-border-main rounded-lg outline-none placeholder:text-support-500 focus:border-primary-600/50 transition-all duration-200"
              />
              {search && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-support-500 hover:text-support-200 rounded transition-colors"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <IconX size={12} />
                </button>
              )}
            </div>
            <span className="text-[11px] text-support-600 tabular-nums">
              {search
                ? `${visibleRows.length} of ${rowsCount} rows`
                : `${rowsCount} ${rowsCount === 1 ? "row" : "rows"} · ${columnCount} ${columnCount === 1 ? "col" : "cols"}`}
            </span>
          </div>

          {/* Table */}
          <div className="border border-border-main/60 rounded-lg overflow-x-auto flex-1 flex flex-col">
            {/* Column headers */}
            <div
              className="grid border-b border-border-main/60 bg-dark-800/30 sticky top-0 z-10"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div
                className={hasPinned ? "bg-dark-800" : ""}
                style={hasPinned ? { position: "sticky", left: 0, zIndex: 2 } : undefined}
              />
              <div
                className={`px-1 py-2.5 text-[10px] text-center text-support-600 font-medium ${hasPinned ? "bg-dark-800" : ""}`}
                style={hasPinned ? { position: "sticky", left: 28, zIndex: 2 } : undefined}
              >
                #
              </div>
              {displayOrder.map((colIdx, displayIdx) => {
                const col = table.columns[colIdx];
                const isPinned = displayIdx < pinnedCols.length;
                return (
                  <div
                    key={col.name ?? colIdx}
                    className={`group/col flex items-center ${isPinned ? "bg-dark-800 border-r border-border-main/40" : ""}`}
                    style={
                      isPinned
                        ? { position: "sticky", left: PRE_W + displayIdx * PIN_W, zIndex: 2 }
                        : undefined
                    }
                  >
                    <button
                      className="flex-1 min-w-0 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-support-500 truncate flex items-center gap-1.5 hover:text-support-300 transition-colors cursor-pointer"
                      onClick={() => toggleSort(colIdx)}
                    >
                      <span className="truncate">{col.name}</span>
                      {sort.column === colIdx && sort.dir === "asc" && (
                        <IconSortAscending size={13} className="shrink-0 text-primary-400" />
                      )}
                      {sort.column === colIdx && sort.dir === "desc" && (
                        <IconSortDescending size={13} className="shrink-0 text-primary-400" />
                      )}
                    </button>
                    <button
                      className={`shrink-0 p-1 mr-1.5 rounded transition-all cursor-pointer ${
                        isPinned
                          ? "text-primary-400 hover:text-primary-300"
                          : "text-support-700 opacity-0 group-hover/col:opacity-100 hover:text-support-400"
                      }`}
                      onClick={() => togglePin(col.name)}
                      title={isPinned ? "Unpin column" : "Pin column"}
                    >
                      <IconPin size={12} />
                    </button>
                  </div>
                );
              })}
              <div />
            </div>

            {/* Data rows */}
            {visibleRows.length === 0 ? (
              <div className="px-3 py-12 text-center">
                <p className="text-sm text-support-500">
                  {search ? "No matching rows" : "No rows yet"}
                </p>
                {!search && (
                  <button
                    className="mt-2 text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setTempRow([]);
                      setRowErrors([]);
                      setAddRowOpen(true);
                    }}
                  >
                    Add your first row
                  </button>
                )}
              </div>
            ) : (
              <div>
                {visibleRows.map(({ cells, originalIndex }) => (
                  <div
                    key={originalIndex}
                    draggable={canDrag}
                    onDragStart={canDrag ? (e) => handleDragStart(e, originalIndex) : undefined}
                    onDragEnd={canDrag ? handleDragEnd : undefined}
                    onDragOver={canDrag ? (e) => handleDragOver(e, originalIndex) : undefined}
                    onDrop={canDrag ? (e) => handleDrop(e, originalIndex) : undefined}
                    className={`grid group transition-colors duration-75 border-b border-border-main/30 last:border-b-0 ${dragOver === originalIndex && dragFrom !== originalIndex
                      ? "bg-primary-600/8 border-t-2 border-t-primary-500"
                      : "hover:bg-dark-800/40"
                      }`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    <div
                      className={`flex items-center justify-center ${hasPinned ? "bg-dark-900" : ""}`}
                      style={hasPinned ? { position: "sticky", left: 0, zIndex: 2 } : undefined}
                    >
                      {canDrag ? (
                        <span className="cursor-grab active:cursor-grabbing text-support-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          <IconGripVertical size={13} />
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>
                    <div
                      className={`px-1 py-2 text-[10px] text-center text-support-700 self-center tabular-nums select-none ${hasPinned ? "bg-dark-900" : ""}`}
                      style={hasPinned ? { position: "sticky", left: 28, zIndex: 2 } : undefined}
                    >
                      {originalIndex + 1}
                    </div>
                    {displayOrder.map((colIdx, displayIdx) => {
                      const isPinned = displayIdx < pinnedCols.length;
                      return (
                        <div
                          key={colIdx}
                          className={isPinned ? "bg-dark-900 border-r border-border-main/40" : ""}
                          style={
                            isPinned
                              ? { position: "sticky", left: PRE_W + displayIdx * PIN_W, zIndex: 2 }
                              : undefined
                          }
                        >
                          <EditableCell
                            value={cells[colIdx]}
                            colType={getColumnType(active, table.columns[colIdx]?.name ?? "", table)}
                            onCommit={(v) => updateCell(originalIndex, colIdx, v)}
                          />
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-center">
                      <button
                        className="p-2 rounded text-support-600 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-danger-400 hover:bg-danger-900/30 transition-all focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                        onClick={() => deleteRow(originalIndex)}
                        aria-label={`Delete row ${originalIndex + 1}`}
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals row */}
            {hasFunctions && visibleRows.length > 0 && (
              <div
                className="grid border-t mt-auto border-border-main/60 bg-dark-800/25"
                style={{ gridTemplateColumns: gridCols }}
              >
                <div
                  className={hasPinned ? "bg-dark-800" : ""}
                  style={hasPinned ? { position: "sticky", left: 0, zIndex: 2 } : undefined}
                />
                <div
                  className={`px-1 py-2 text-xs text-center text-support-500 self-center ${hasPinned ? "bg-dark-800" : ""}`}
                  style={hasPinned ? { position: "sticky", left: 28, zIndex: 2 } : undefined}
                >
                  <IconMathFunction size={12} />
                </div>
                {displayOrder.map((colIdx, displayIdx) => {
                  const col = table.columns[colIdx];
                  const isPinned = displayIdx < pinnedCols.length;
                  const entry = colFunctions[col.name];
                  const fn = entry?.fn ?? "none";
                  const result = totalsResults[colIdx];
                  const label =
                    fn === "custom" && entry?.customExpr
                      ? entry.customExpr.length > 16
                        ? entry.customExpr.slice(0, 14) + "..."
                        : entry.customExpr
                      : fn;
                  return (
                    <div
                      key={col.name ?? colIdx}
                      className={`px-3 py-2 text-sm font-mono tabular-nums ${isPinned ? "bg-dark-800 border-r border-border-main/40" : ""}`}
                      style={
                        isPinned
                          ? { position: "sticky", left: PRE_W + displayIdx * PIN_W, zIndex: 2 }
                          : undefined
                      }
                    >
                      {result != null ? (
                        <span className="flex items-baseline justify-end gap-1.5">
                          <span
                            className="text-[10px] uppercase text-support-600 truncate max-w-[5rem]"
                            title={fn === "custom" ? entry?.customExpr : fn}
                          >
                            {label}
                          </span>
                          <span className="font-medium text-primary-300 text-right">{result}</span>
                        </span>
                      ) : (
                        <span className="text-support-600 text-right block">&mdash;</span>
                      )}
                    </div>
                  );
                })}
                <div />
              </div>
            )}
          </div>

          {/* Footer */}
          {visibleRows.length > 0 && (
            <div className="mt-3">
              <button
                className="flex items-center gap-1.5 text-[11px] text-support-600 hover:text-support-400 transition-colors cursor-pointer"
                onClick={() => {
                  setTempRow([]);
                  setRowErrors([]);
                  setAddRowOpen(true);
                }}
              >
                <IconRowInsertTop size={13} />
                Add row
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ---- Add row dialog ---- */}
      <Dialog
        title="Add row"
        description={`${columnCount} fields`}
        bodyClassName="px-6"
        open={addRowOpen}
        onClose={() => setAddRowOpen(false)}
        widthClass="w-[28rem]"
      >
        <div className="flex flex-col gap-3.5">
          {table.columns.map((col, index) => {
            const colType = getColumnType(active, col.name, table);
            return (
              <FocusBaseInput
                key={col.name ?? index}
                col={col}
                index={index}
                colType={colType}
                tempRow={tempRow}
                setTempRow={setTempRow}
                rowErrors={rowErrors}
                setRowErrors={setRowErrors}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2 pt-5 mt-2 border-t border-border-main/50">
          <Button variant="tonal" size="sm" onClick={() => setAddRowOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" icon={<IconCheck size={14} />} onClick={addRow}>
            Add row
          </Button>
        </div>
      </Dialog>

      {/* ---- Add column dialog ---- */}
      <Dialog
        title="Add column"
        bodyClassName="px-6"
        open={addColOpen}
        onClose={() => setAddColOpen(false)}
        widthClass="w-[24rem]"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Column name"
            value={tempCol.name}
            onChange={(e) => setTempCol((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tempCol.name.trim()) addColumn();
            }}
          />
          <NativeSelect
            label="Data type"
            value={tempCol.type}
            onChange={(e) =>
              setTempCol((prev) => ({ ...prev, type: e.target.value as ColumnType }))
            }
            options={[
              { value: "string", label: "Text" },
              { value: "number", label: "Number" },
              { value: "date", label: "Date" },
              { value: "boolean", label: "Boolean" },
            ]}
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-5 mt-2 border-t border-border-main/50">
          <Button variant="tonal" size="sm" onClick={() => setAddColOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            icon={<IconCheck size={14} />}
            onClick={addColumn}
            disabled={!tempCol.name.trim()}
          >
            Add column
          </Button>
        </div>
      </Dialog>

      {/* ---- Column functions dialog ---- */}
      <Dialog
        title="Column functions"
        description="Assign aggregation functions to columns"
        bodyClassName="px-6"
        open={fnDialogOpen}
        onClose={() => setFnDialogOpen(false)}
        widthClass="w-[34rem]"
      >
        <div className="flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto -mx-1 px-1">
          {table.columns.map((col) => {
            const entry = colFunctions[col.name] ?? { fn: "none" as const };
            const isActive = entry.fn !== "none";
            return (
              <div
                key={col.name}
                className={`rounded-lg border p-3.5 transition-colors ${isActive ? "border-primary-500/20 bg-primary-600/5" : "border-border-main/40"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold flex-1 min-w-0 truncate ${isActive ? "text-primary-400" : "text-support-300"}`}
                  >
                    {col.name}
                  </span>
                  <div className="w-32 shrink-0">
                    <NativeSelect
                      size="sm"
                      value={entry.fn}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "custom") {
                          setColumnFunction(col.name, val as any);
                        } else {
                          setColumnFunction(col.name, "custom", entry.customExpr ?? "");
                        }
                      }}
                      options={EXCEL_FUNCTIONS.map((fn) => ({ value: fn.value, label: fn.label }))}
                    />
                  </div>
                </div>

                {entry.fn === "custom" && (
                  <CustomExpressionEditor
                    expr={entry.customExpr ?? ""}
                    columns={table.columns}
                    savedFns={savedFormulas}
                    onSave={(expr) => setColumnFunction(col.name, "custom", expr)}
                    onSaveToLibrary={saveFormulaToLibrary}
                  />
                )}
              </div>
            );
          })}
        </div>

        {savedFormulas.length > 0 && (
          <div className="border-t border-border-main/50 pt-4 mt-4">
            <p className="text-[10px] font-semibold text-support-500 uppercase tracking-wider mb-2">
              Saved formulas
            </p>
            <div className="flex flex-col gap-1">
              {savedFormulas.map((fn) => (
                <div
                  key={fn.name}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-dark-800/30 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconBookmark size={11} className="shrink-0 text-primary-400" />
                    <span className="text-xs font-medium truncate text-support-200">{fn.name}</span>
                    <span className="text-[10px] font-mono text-support-600 truncate">
                      {fn.expr}
                    </span>
                  </div>
                  <button
                    className="shrink-0 p-1.5 rounded text-support-700 opacity-0 group-hover:opacity-100 hover:text-danger-400 transition-all"
                    onClick={() => deleteFormulaFromLibrary(fn.name)}
                    aria-label={`Delete ${fn.name}`}
                  >
                    <IconTrash size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-4 mt-2 border-t border-border-main/50">
          <Button size="sm" variant="tonal" onClick={() => setFnDialogOpen(false)}>
            Done
          </Button>
        </div>
      </Dialog>

      {/* ---- Edit table props dialog ---- */}
      <CreateTableDialog
        open={editPropsOpen}
        setOpen={setEditPropsOpen}
        editSheet={active}
        onCreated={() => {
          loadTableFromSheet(active, setTable, setRowsCount);
        }}
      />
    </>
  );
}

const FocusBaseInput = ({
  col,
  index,
  setRowErrors,
  setTempRow,
  rowErrors,
  tempRow,
  colType,
}: any) => {
  const ref = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(tempRow[index] ?? "");
  const inputRef = useRef(input);
  inputRef.current = input;

  const sync = useCallback(() => {
    setTempRow((prev: any) => {
      const next = [...prev];
      next[index] = inputRef.current;
      return next;
    });
    setRowErrors((prev: any) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }, [index, setTempRow, setRowErrors]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("focusout", sync);
    return () => el.removeEventListener("focusout", sync);
  }, [sync]);

  if (colType === "number") {
    return (
      <NumberInput
        label={col.name}
        value={input === "" ? "" : Number(input)}
        onChange={(val) => {
          const str = val === "" ? "" : String(val);
          setInput(str);
          inputRef.current = str;
          sync();
        }}
        placeholder="0"
        error={rowErrors[index] ?? undefined}
        allowNegative
      />
    );
  }

  if (colType === "date") {
    return (
      <DatePicker
        label={col.name}
        value={input}
        onChange={(val) => {
          setInput(val);
          inputRef.current = val;
          sync();
        }}
        placeholder="Select date"
        error={rowErrors[index] ?? undefined}
        clearable
      />
    );
  }

  return (
    <Input
      ref={ref}
      label={col.name}
      onChange={(e) => setInput(e.target.value)}
      placeholder={colType !== "string" ? colType : undefined}
      error={rowErrors[index] ?? undefined}
      value={input}
    />
  );
};

export default SheetEditor;
