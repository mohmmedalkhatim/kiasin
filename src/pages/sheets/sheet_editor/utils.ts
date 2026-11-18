import { Dispatch, SetStateAction } from "react";
import * as exceljs from "exceljs";
import { Sheet, SheetDTO } from "../../../contexts/sheets/objects";
import { update_sheet } from "../../../contexts/sheets/functions/update";
import { AppDispatch } from "../../../contexts/store";
import { Buffer } from "buffer";
import { ColumnType, SortState, IndexedRow } from "./types";

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

export function colLetterToIndex(letters: string): number {
  let n = 0;
  for (const ch of letters.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n;
}

export const loadTableFromSheet = async (
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

export function buildDescriptionFromTable(
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

export function inferColumnType(table: exceljs.Table, colIdx: number): string {
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

export const persistTable = async (
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

export function validateCell(value: string, type: ColumnType): string | null {
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

export function parseDescriptionColumns(desc: string): { name: string; type: string }[] {
  try {
    const parsed = JSON.parse(desc);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.columns && Array.isArray(parsed.columns)) return parsed.columns;
    return [];
  } catch {
    return [];
  }
}

export function getColumnType(
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

export function sortRows(rows: IndexedRow[], sort: SortState, colType: ColumnType): IndexedRow[] {
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
// Date helpers
// ---------------------------------------------------------------------------

export const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
export const MONTHS = [
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

export function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function fmtDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
