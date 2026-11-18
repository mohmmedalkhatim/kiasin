export type ColumnType = "string" | "number" | "date" | "boolean";

export type SortDir = "asc" | "desc" | null;
export type SortState = { column: number; dir: SortDir };
export type IndexedRow = { cells: any[]; originalIndex: number };
