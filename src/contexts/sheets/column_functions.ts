import { storage } from "../../main";

// ---------------------------------------------------------------------------
// Built-in functions
// ---------------------------------------------------------------------------

export type BuiltinFunction =
  | "none"
  | "sum"
  | "average"
  | "count"
  | "min"
  | "max"
  | "countNums";

export type ExcelFunction = BuiltinFunction | "custom";

export const BUILTIN_FUNCTIONS: { value: BuiltinFunction; label: string }[] = [
  { value: "none", label: "None" },
  { value: "sum", label: "Sum" },
  { value: "average", label: "Average" },
  { value: "count", label: "Count" },
  { value: "min", label: "Min" },
  { value: "max", label: "Max" },
  { value: "countNums", label: "Count Numbers" },
];

export const EXCEL_FUNCTIONS: { value: ExcelFunction; label: string }[] = [
  ...BUILTIN_FUNCTIONS,
  { value: "custom", label: "Custom" },
];

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export interface ColumnFunctionEntry {
  fn: ExcelFunction;
  customExpr?: string;
}

type ColumnFunctionsMap = Record<string, ColumnFunctionEntry>;

function storageKey(sheetName: string): string {
  return `sheet_functions:${sheetName}`;
}

function customFnStorageKey(): string {
  return `custom_functions_library`;
}

export async function loadColumnFunctions(
  sheetName: string,
): Promise<ColumnFunctionsMap> {
  const saved = await storage.get<ColumnFunctionsMap>(storageKey(sheetName));
  if (!saved) return {};
  // migrate from old format (plain ExcelFunction strings)
  const result: ColumnFunctionsMap = {};
  for (const [k, v] of Object.entries(saved)) {
    if (typeof v === "string") {
      result[k] = { fn: v as ExcelFunction };
    } else {
      result[k] = v;
    }
  }
  return result;
}

export async function saveColumnFunctions(
  sheetName: string,
  fns: ColumnFunctionsMap,
): Promise<void> {
  await storage.set(storageKey(sheetName), fns);
  await storage.save();
}

// ---------------------------------------------------------------------------
// Custom function library (user-saved reusable formulas)
// ---------------------------------------------------------------------------

export interface SavedCustomFunction {
  name: string;
  expr: string;
}

export async function loadCustomFunctionLibrary(): Promise<
  SavedCustomFunction[]
> {
  const saved = await storage.get<SavedCustomFunction[]>(
    customFnStorageKey(),
  );
  return saved ?? [];
}

export async function saveCustomFunctionLibrary(
  fns: SavedCustomFunction[],
): Promise<void> {
  await storage.set(customFnStorageKey(), fns);
  await storage.save();
}

// ---------------------------------------------------------------------------
// Built-in computation
// ---------------------------------------------------------------------------

export function computeColumnResult(
  rows: any[][],
  colIndex: number,
  entry: ColumnFunctionEntry,
  allColumns?: { name: string }[],
): string | null {
  const { fn, customExpr } = entry;

  if (fn === "none" || rows.length === 0) return null;

  if (fn === "custom" && customExpr && allColumns) {
    return evaluateCustomExpression(customExpr, rows, allColumns);
  }

  const nums = rows
    .map((r) => Number(r[colIndex]))
    .filter((n) => !Number.isNaN(n));

  if (nums.length === 0) return fn === "count" ? String(rows.length) : null;

  switch (fn) {
    case "sum":
      return formatNum(nums.reduce((a, b) => a + b, 0));
    case "average":
      return formatNum(nums.reduce((a, b) => a + b, 0) / nums.length);
    case "count":
      return String(
        rows.filter((r) => r[colIndex] != null && r[colIndex] !== "").length,
      );
    case "min":
      return formatNum(Math.min(...nums));
    case "max":
      return formatNum(Math.max(...nums));
    case "countNums":
      return String(nums.length);
    default:
      return null;
  }
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

// ---------------------------------------------------------------------------
// Safe expression parser & evaluator
//
// Grammar:
//   expr     = term (('+' | '-') term)*
//   term     = factor (('*' | '/') factor)*
//   factor   = NUMBER | aggregate | '(' expr ')' | '-' factor
//   aggregate = FUNC_NAME '(' COL_NAME ')'
//
// FUNC_NAME: sum | avg | average | min | max | count | median | stdev
// COL_NAME:  any identifier (letters, digits, spaces, underscores)
// ---------------------------------------------------------------------------

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: string }
  | { type: "paren"; value: "(" | ")" }
  | { type: "func"; value: string }
  | { type: "col"; value: string };

const AGG_NAMES = new Set([
  "sum",
  "avg",
  "average",
  "min",
  "max",
  "count",
  "median",
  "stdev",
  "abs",
  "round",
  "floor",
  "ceil",
]);

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.trim();

  while (i < s.length) {
    if (s[i] === " ") {
      i++;
      continue;
    }

    if ("+-*/".includes(s[i])) {
      tokens.push({ type: "op", value: s[i] });
      i++;
      continue;
    }

    if (s[i] === "(") {
      tokens.push({ type: "paren", value: "(" });
      i++;
      continue;
    }

    if (s[i] === ")") {
      tokens.push({ type: "paren", value: ")" });
      i++;
      continue;
    }

    // number
    if (/[0-9.]/.test(s[i])) {
      let num = "";
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i];
        i++;
      }
      tokens.push({ type: "num", value: parseFloat(num) });
      continue;
    }

    // identifier (function name or column name)
    if (/[a-zA-Z_]/.test(s[i])) {
      let ident = "";
      while (i < s.length && /[a-zA-Z0-9_ ]/.test(s[i])) {
        ident += s[i];
        i++;
      }
      ident = ident.trimEnd();

      if (AGG_NAMES.has(ident.toLowerCase()) && i < s.length && s[i] === "(") {
        tokens.push({ type: "func", value: ident.toLowerCase() });
      } else {
        tokens.push({ type: "col", value: ident });
      }
      continue;
    }

    i++;
  }

  return tokens;
}

function getColumnNums(
  colName: string,
  rows: any[][],
  columns: { name: string }[],
): number[] {
  const idx = columns.findIndex(
    (c) => c.name.toLowerCase() === colName.toLowerCase(),
  );
  if (idx === -1) return [];
  return rows
    .map((r) => Number(r[idx]))
    .filter((n) => !Number.isNaN(n));
}

function computeAggregate(
  funcName: string,
  colName: string,
  rows: any[][],
  columns: { name: string }[],
): number {
  const nums = getColumnNums(colName, rows, columns);
  if (nums.length === 0) return 0;

  switch (funcName) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
    case "average":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
    case "count":
      return nums.length;
    case "median": {
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    case "stdev": {
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const variance =
        nums.reduce((acc, n) => acc + (n - mean) ** 2, 0) / nums.length;
      return Math.sqrt(variance);
    }
    default:
      return 0;
  }
}

function computeUnary(funcName: string, arg: number): number {
  switch (funcName) {
    case "abs":
      return Math.abs(arg);
    case "round":
      return Math.round(arg);
    case "floor":
      return Math.floor(arg);
    case "ceil":
      return Math.ceil(arg);
    default:
      return arg;
  }
}

const UNARY_FUNCS = new Set(["abs", "round", "floor", "ceil"]);

class Parser {
  private tokens: Token[];
  private pos = 0;
  private rows: any[][];
  private columns: { name: string }[];

  constructor(tokens: Token[], rows: any[][], columns: { name: string }[]) {
    this.tokens = tokens;
    this.rows = rows;
    this.columns = columns;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: string, value?: string): Token {
    const t = this.advance();
    if (!t || t.type !== type || (value !== undefined && t.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ""}`);
    }
    return t;
  }

  parseExpr(): number {
    let left = this.parseTerm();
    while (
      this.peek()?.type === "op" &&
      (this.peek()!.value === "+" || this.peek()!.value === "-")
    ) {
      const op = this.advance().value;
      const right = this.parseTerm();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseTerm(): number {
    let left = this.parseFactor();
    while (
      this.peek()?.type === "op" &&
      (this.peek()!.value === "*" || this.peek()!.value === "/")
    ) {
      const op = this.advance().value;
      const right = this.parseFactor();
      left = op === "*" ? left * right : right !== 0 ? left / right : 0;
    }
    return left;
  }

  private parseFactor(): number {
    const t = this.peek();
    if (!t) throw new Error("Unexpected end of expression");

    // unary minus
    if (t.type === "op" && t.value === "-") {
      this.advance();
      return -this.parseFactor();
    }

    // number literal
    if (t.type === "num") {
      this.advance();
      return t.value;
    }

    // parenthesized expression
    if (t.type === "paren" && t.value === "(") {
      this.advance();
      const val = this.parseExpr();
      this.expect("paren", ")");
      return val;
    }

    // function call: aggregate(column) or unary(expr)
    if (t.type === "func") {
      const funcName = this.advance().value as string;
      this.expect("paren", "(");

      if (UNARY_FUNCS.has(funcName)) {
        const arg = this.parseExpr();
        this.expect("paren", ")");
        return computeUnary(funcName, arg);
      }

      // aggregate: argument is a column name
      let colName = "";
      while (
        this.peek() &&
        !(this.peek()!.type === "paren" && this.peek()!.value === ")")
      ) {
        const next = this.advance();
        if (next.type === "col") colName += next.value;
        else if (next.type === "num") colName += String(next.value);
        else if (next.type === "op") colName += next.value;
        else colName += String(next.value);
      }
      this.expect("paren", ")");
      return computeAggregate(
        funcName,
        colName.trim(),
        this.rows,
        this.columns,
      );
    }

    // bare column name — treat as sum of that column
    if (t.type === "col") {
      this.advance();
      return computeAggregate("sum", t.value, this.rows, this.columns);
    }

    throw new Error(`Unexpected token: ${JSON.stringify(t)}`);
  }
}

export function evaluateCustomExpression(
  expr: string,
  rows: any[][],
  columns: { name: string }[],
): string | null {
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return null;
    const parser = new Parser(tokens, rows, columns);
    const result = parser.parseExpr();
    if (!Number.isFinite(result)) return null;
    return formatNum(result);
  } catch {
    return null;
  }
}

export function validateExpression(
  expr: string,
  columns: { name: string }[],
): string | null {
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return "Expression is empty";

    // Check that referenced columns exist
    for (const t of tokens) {
      if (t.type === "col") {
        const found = columns.some(
          (c) => c.name.toLowerCase() === t.value.toLowerCase(),
        );
        if (!found) return `Unknown column: "${t.value}"`;
      }
    }

    // Try a dry-run parse with empty rows
    const parser = new Parser(tokens, [], columns);
    parser.parseExpr();
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid expression";
  }
}
