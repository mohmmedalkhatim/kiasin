import { RootState } from "../../../contexts/store";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as exceljs from "exceljs";
import { useAsync } from "react-use";
import Header from "../../../components/header";
import HeaderAction from "../../area/Header/action";
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
} from "@tabler/icons-react";
import { Sheet, SheetDTO } from "../../../contexts/sheets/objects";
import { update_sheet } from "../../../contexts/sheets/functions/update";
import { Dialog } from "../../../components/Dialog";
import Button from "../../../components/Button";
import Input from "../../../components/input";
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

const persistTable = async (
  active: Sheet | null,
  table: exceljs.Table | null,
  dispatch: AppDispatch,
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
    const dto: SheetDTO = {
      ...active,
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

function getColumnType(active: Sheet | null, colName: string): ColumnType {
  const info = active?.rows_info?.find((r) => r.name === colName);
  return (info?.type as ColumnType) ?? "string";
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
        className="px-3 py-2 text-sm truncate cursor-text min-h-[2.25rem] select-none"
        onDoubleClick={() => {
          setDraft(String(value ?? ""));
          setEditing(true);
        }}
      >
        {value !== undefined && value !== null && value !== "" ? (
          String(value)
        ) : (
          <span className="text-support-600">&mdash;</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className={`w-full px-3 py-1.5 text-sm bg-dark-800 outline-none border ${error ? "border-danger-500" : "border-primary-600"
          }`}
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

  // ---- persistence ----

  const saveTable = useCallback(
    async (nextTable: exceljs.Table | null) => {
      if (pendingSave.current) return;
      pendingSave.current = true;
      try {
        await persistTable(active, nextTable, dispatch);
      } finally {
        pendingSave.current = false;
      }
    },
    [active, dispatch],
  );

  const applyAndSave = useCallback(
    (updater: (prev: exceljs.Table) => exceljs.Table) => {
      setTable((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        saveTable(next);
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
      validateCell(tempRow[i] ?? "", getColumnType(active, col.name)),
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
    applyAndSave((prev) => ({
      ...prev,
      columns: [...prev.columns, { name, filterButton: false }],
      rows: (prev.rows ?? []).map((r) => [...r, ""]),
    }));
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

  const handleDragStart = useCallback((e: React.DragEvent, rowIndex: number) => {
    setDragFrom(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(rowIndex));
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
      const colType = getColumnType(active, table.columns[sort.column]?.name ?? "");
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
        <Header>
          <div className="text-sm font-medium">{active?.name ?? "Sheet"}</div>
        </Header>
        <div className="pt-28 flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-support-400">Loading sheet...</p>
        </div>
      </main>
    );
  }

  if (!table?.columns) {
    return (
      <main className="relative w-full">
        <Header>
          <div className="text-sm font-medium">{active?.name ?? "Sheet"}</div>
        </Header>
        <div className="pt-28 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <IconTable size={40} className="text-support-500" strokeWidth={1.5} />
          <p className="text-sm text-support-400">No table data found</p>
        </div>
      </main>
    );
  }

  const columnCount = table.columns.length;
  const gridCols = `28px 48px repeat(${columnCount}, minmax(8rem, 1fr)) 48px`;

  return (
    <>
      <main className="relative">
        <Header>
          <div className="text-sm font-medium">{active?.name}</div>
          <div className="h-full py-2 flex items-center gap-2">
            <HeaderAction description="Functions" onClick={() => setFnDialogOpen(true)}>
              <IconMathFunction size={24} />
            </HeaderAction>
            <HeaderAction description="Add column" onClick={() => setAddColOpen(true)}>
              <IconTableColumn size={24} />
            </HeaderAction>
            <HeaderAction
              description="Add row"
              onClick={() => {
                setTempRow([]);
                setRowErrors([]);
                setAddRowOpen(true);
              }}
            >
              <IconRowInsertTop size={24} />
            </HeaderAction>
          </div>
        </Header>

        <div className="pt-14 px-6 pb-6">
          {/* Search bar */}
          <div className="mb-3 flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <IconSearch
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-support-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search rows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-8 text-sm bg-dark-900 border border-border-main rounded-md outline-none focus:border-primary-600 transition-colors"
              />
              {search && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-support-500 hover:text-support-200 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
            {search && (
              <span className="text-xs text-support-500 whitespace-nowrap">
                {visibleRows.length} of {rowsCount}
              </span>
            )}
          </div>

          {/* Table */}
          <div className="border border-border-main rounded-lg overflow-x-auto">
            {/* Column headers */}
            <div
              className="grid border-b border-border-main bg-dark-900/60 sticky top-0 z-10"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div />
              <div className="px-1 py-2.5 text-xs text-center text-support-500">#</div>
              {table.columns.map((col, i) => (
                <button
                  key={col.name ?? i}
                  className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-support-400 truncate flex items-center gap-1.5 hover:text-support-200 transition-colors"
                  onClick={() => toggleSort(i)}
                >
                  <span className="truncate">{col.name}</span>
                  {sort.column === i && sort.dir === "asc" && (
                    <IconSortAscending size={14} className="shrink-0 text-primary-400" />
                  )}
                  {sort.column === i && sort.dir === "desc" && (
                    <IconSortDescending size={14} className="shrink-0 text-primary-400" />
                  )}
                </button>
              ))}
              <div />
            </div>

            {/* Data rows */}
            {visibleRows.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-support-500">
                {search ? "No matching rows" : "No rows yet"}
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {visibleRows.map(({ cells, originalIndex }) => (
                  <div
                    key={originalIndex}
                    draggable={canDrag}
                    onDragStart={canDrag ? (e) => handleDragStart(e, originalIndex) : undefined}
                    onDragEnd={canDrag ? handleDragEnd : undefined}
                    onDragOver={canDrag ? (e) => handleDragOver(e, originalIndex) : undefined}
                    onDrop={canDrag ? (e) => handleDrop(e, originalIndex) : undefined}
                    className={`grid group transition-colors duration-100 ${dragOver === originalIndex && dragFrom !== originalIndex
                      ? "bg-primary-600/8 border-t-2 border-t-primary-500"
                      : "hover:bg-dark-800/40"
                      }`}
                    style={{ gridTemplateColumns: gridCols }}
                  >
                    <div className="flex items-center justify-center">
                      {canDrag ? (
                        <span className="cursor-grab active:cursor-grabbing text-support-600 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          <IconGripVertical size={14} />
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>
                    <div className="px-1 py-2 text-xs text-center text-support-600 self-center tabular-nums">
                      {originalIndex + 1}
                    </div>
                    {cells.map((cell, cellIndex) => (
                      <EditableCell
                        key={cellIndex}
                        value={cell}
                        colType={getColumnType(active, table.columns[cellIndex]?.name ?? "")}
                        onCommit={(v) => updateCell(originalIndex, cellIndex, v)}
                      />
                    ))}
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
                className="grid border-t border-border-main bg-dark-900/80"
                style={{ gridTemplateColumns: gridCols }}
              >
                <div />
                <div className="px-1 py-2 text-xs text-center text-support-500 self-center">
                  <IconMathFunction size={12} />
                </div>
                {table.columns.map((col, i) => {
                  const entry = colFunctions[col.name];
                  const fn = entry?.fn ?? "none";
                  const result = totalsResults[i];
                  const label =
                    fn === "custom" && entry?.customExpr
                      ? entry.customExpr.length > 16
                        ? entry.customExpr.slice(0, 14) + "..."
                        : entry.customExpr
                      : fn;
                  return (
                    <div key={col.name ?? i} className="px-3 py-2 text-sm tabular-nums">
                      {result != null ? (
                        <span className="flex items-baseline gap-1.5">
                          <span
                            className="text-xs uppercase text-support-500 truncate max-w-[6rem]"
                            title={fn === "custom" ? entry?.customExpr : fn}
                          >
                            {label}
                          </span>
                          <span className="font-medium text-primary-300">{result}</span>
                        </span>
                      ) : (
                        <span className="text-support-600">&mdash;</span>
                      )}
                    </div>
                  );
                })}
                <div />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <Button
              variant="outlined"
              size="sm"
              icon={<IconRowInsertTop size={16} />}
              onClick={() => {
                setTempRow([]);
                setRowErrors([]);
                setAddRowOpen(true);
              }}
            >
              Add row
            </Button>
            <span className="text-xs text-support-500 tabular-nums">
              {rowsCount} {rowsCount === 1 ? "row" : "rows"} &middot; {columnCount}{" "}
              {columnCount === 1 ? "column" : "columns"}
            </span>
          </div>
        </div>
      </main>

      {/* ---- Add row dialog ---- */}
      <Dialog
        title="Add row"
        bodyClassName="px-5"
        open={addRowOpen}
        onClose={() => setAddRowOpen(false)}
        widthClass="w-[28rem]"
      >
        <div className="flex flex-col gap-3">
          {table.columns.map((col, index) => {
            const colType = getColumnType(active, col.name);
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
        <div className="pt-4">
          <Button className="w-full" icon={<IconCheck size={18} />} onClick={addRow}>
            Add
          </Button>
        </div>
      </Dialog>

      {/* ---- Add column dialog ---- */}
      <Dialog
        title="Add column"
        bodyClassName="px-5"
        open={addColOpen}
        onClose={() => setAddColOpen(false)}
        widthClass="w-[24rem]"
      >
        <div className="flex flex-col gap-3">
          <Input
            label="Column name"
            value={tempCol.name}
            onChange={(e) => setTempCol((prev) => ({ ...prev, name: e.target.value }))}
          />
          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["string", "number", "date", "boolean"] as ColumnType[]).map((t) => (
                <button
                  key={t}
                  className={`h-8 text-xs rounded-md border transition-colors ${tempCol.type === t
                    ? "border-primary-600 bg-primary-600/10 text-primary-400"
                    : "border-border-main text-support-400 hover:border-support-500"
                    }`}
                  onClick={() => setTempCol((prev) => ({ ...prev, type: t }))}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button
            className="w-full"
            icon={<IconCheck size={18} />}
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
        bodyClassName="px-5"
        open={fnDialogOpen}
        onClose={() => setFnDialogOpen(false)}
        widthClass="w-[34rem]"
      >
        <div className="flex flex-col gap-5">
          {table.columns.map((col) => {
            const entry = colFunctions[col.name] ?? { fn: "none" as const };
            return (
              <div key={col.name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{col.name}</label>
                <div className="flex flex-wrap gap-1.5">
                  {EXCEL_FUNCTIONS.map((fn) => (
                    <button
                      key={fn.value}
                      className={`h-7 px-2.5 text-xs rounded-md border transition-colors ${entry.fn === fn.value
                        ? "border-primary-600 bg-primary-600/10 text-primary-400"
                        : "border-border-main text-support-400 hover:border-support-500"
                        }`}
                      onClick={() => {
                        if (fn.value !== "custom") {
                          setColumnFunction(col.name, fn.value);
                        } else {
                          setColumnFunction(col.name, "custom", entry.customExpr ?? "");
                        }
                      }}
                    >
                      {fn.label}
                    </button>
                  ))}
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

          {/* Saved formulas management */}
          {savedFormulas.length > 0 && (
            <div className="border-t border-border-main pt-4">
              <label className="text-xs font-medium text-support-400 uppercase tracking-wide">
                Saved formulas
              </label>
              <div className="flex flex-col gap-1.5 mt-2">
                {savedFormulas.map((fn) => (
                  <div
                    key={fn.name}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-dark-800/40"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconBookmark size={12} className="shrink-0 text-primary-400" />
                      <span className="text-xs font-medium truncate">{fn.name}</span>
                      <span className="text-[10px] font-mono text-support-500 truncate">
                        {fn.expr}
                      </span>
                    </div>
                    <button
                      className="shrink-0 p-2 rounded text-support-600 hover:text-danger-400 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                      onClick={() => deleteFormulaFromLibrary(fn.name)}
                      aria-label={`Delete ${fn.name} formula`}
                    >
                      <IconTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="pt-4">
          <Button className="w-full" variant="tonal" onClick={() => setFnDialogOpen(false)}>
            Done
          </Button>
        </div>
      </Dialog>
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
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
    };
    el.addEventListener("focusout", handler);
    return () => el.removeEventListener("focusout", handler);
  }, [index, setTempRow, setRowErrors]);

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
