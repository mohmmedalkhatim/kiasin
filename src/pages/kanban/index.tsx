import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../contexts/store"
import { create_sheet } from "../../contexts/sheets/functions/create"
import { update_sheet } from "../../contexts/sheets/functions/update"
import type { Sheet, SheetDTO } from "../../contexts/sheets/objects"
import { Channel, invoke } from "@tauri-apps/api/core"
import Header from "../../components/header"
import Button from "../../components/Button"
import Input from "../../components/input"
import NativeSelect from "../../components/native-select"
import DatePicker from "../../components/datepicker"
import { Dialog } from "../../components/Dialog"
import * as exceljs from "exceljs"
import { Buffer } from "buffer"
import {
  DndContext,
  DragOverlay,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconLayoutKanban,
  IconCalendar,
  IconUser,
  IconFlag3,
  IconX,
  IconDots,
  IconEyeOff,
  IconFilter,
  IconCopy,
  IconChevronDown,
  IconChevronRight,
  IconPalette,
  IconPencil,
} from "@tabler/icons-react"

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const SCHEMA_COLS = [
  { name: "Title", type: "string" },
  { name: "Status", type: "string" },
  { name: "Priority", type: "string" },
  { name: "Assignee", type: "string" },
  { name: "Due Date", type: "date" },
]

const DEFAULT_STATUSES = ["To Do", "In Progress", "In Review", "Done"]

const PRIORITIES = [
  { value: "", label: "None" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
]

const PRIORITY_COLORS: Record<string, string> = {
  Low: "text-blue-400 bg-blue-500/10",
  Medium: "text-yellow-400 bg-yellow-500/10",
  High: "text-orange-400 bg-orange-500/10",
  Urgent: "text-danger-400 bg-danger-500/10",
}

const DEFAULT_STATUS_COLORS: Record<string, string> = {
  "To Do": "bg-support-500",
  "In Progress": "bg-blue-500",
  "In Review": "bg-yellow-500",
  "Done": "bg-emerald-500",
}

const COLUMN_COLOR_PRESETS = [
  { value: "bg-support-500", label: "Gray" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-emerald-500", label: "Green" },
  { value: "bg-primary-500", label: "Primary" },
  { value: "bg-danger-500", label: "Red" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-violet-500", label: "Violet" },
  { value: "bg-teal-500", label: "Teal" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-rose-500", label: "Rose" },
]

interface CardRow {
  rowIndex: number
  title: string
  status: string
  priority: string
  assignee: string
  dueDate: string
}

// ── Sheet helpers ──

function colLetterToIndex(letters: string): number {
  let n = 0
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n
}

async function fetchSheets(): Promise<Sheet[]> {
  return new Promise((resolve) => {
    let channel = new Channel<Sheet[]>((res) => resolve(res))
    invoke("sheets_control", { payload: { command: "list" }, channel }).catch(() => resolve([]))
  })
}

async function fetchSheet(id: number): Promise<Sheet | null> {
  return new Promise((resolve) => {
    let channel = new Channel<Sheet[]>((res) => resolve(res[0] ?? null))
    invoke("sheets_control", { payload: { command: "retrieve", id }, channel }).catch(() => resolve(null))
  })
}

async function readTable(sheet: Sheet): Promise<exceljs.Table | null> {
  if (!sheet.file || !sheet.name) return null
  try {
    let workbook = new exceljs.Workbook()
    // @ts-ignore
    let ws = (await workbook.xlsx.load(sheet.file)).worksheets[0]
    let obj = ws.getTable(sheet.name)
    // @ts-ignore
    let tableDef = obj.table as exceljs.Table
    let numCols = tableDef.columns.length
    let refMatch = (tableDef.ref ?? "A1").match(/([A-Z]+)(\d+)/i)
    let startCol = refMatch ? colLetterToIndex(refMatch[1]) : 1
    let headerRow = refMatch ? parseInt(refMatch[2]) : 1
    let dataStartRow = headerRow + 1
    let rows: any[][] = []
    ws.eachRow((row, rowNumber) => {
      if (rowNumber < dataStartRow) return
      let cells: any[] = []
      for (let i = 0; i < numCols; i++) cells.push(row.getCell(startCol + i).value)
      rows.push(cells)
    })
    return { name: tableDef.name, ref: tableDef.ref ?? "A1", columns: tableDef.columns.map(c => ({ name: c.name, filterButton: c.filterButton })), rows } as exceljs.Table
  } catch { return null }
}

async function writeTable(sheet: Sheet, table: exceljs.Table, dispatch: AppDispatch) {
  let wb = new exceljs.Workbook()
  let ws = wb.addWorksheet()
  ws.addTable({ name: table.name, ref: table.ref ?? "A1", columns: table.columns.map(c => ({ name: c.name, filterButton: c.filterButton })), rows: (table.rows ?? []).map(r => [...r]) })
  let buffer = await wb.xlsx.writeBuffer()
  await dispatch(update_sheet({ ...sheet, file: Buffer.from(buffer).toString("base64") } as SheetDTO))
}

function isKanbanSheet(sheet: Sheet): boolean {
  try { return JSON.parse(sheet.description)?.kanban === true } catch { return false }
}

function getStatuses(sheet: Sheet): string[] {
  try { return JSON.parse(sheet.description)?.statuses ?? DEFAULT_STATUSES } catch { return DEFAULT_STATUSES }
}

function getColors(sheet: Sheet): Record<string, string> {
  try { return JSON.parse(sheet.description)?.colors ?? {} } catch { return {} }
}

function resolveColor(colors: Record<string, string>, status: string): string {
  return colors[status] ?? DEFAULT_STATUS_COLORS[status] ?? "bg-support-500"
}

function kanbanDescription(statuses: string[], colors?: Record<string, string>) {
  return JSON.stringify({ kanban: true, statuses, columns: SCHEMA_COLS, ...(colors && Object.keys(colors).length > 0 ? { colors } : {}) })
}

function tableToCards(table: exceljs.Table): CardRow[] {
  let colMap: Record<string, number> = {}
  table.columns.forEach((c, i) => { colMap[c.name] = i })
  return (table.rows ?? []).map((row, i) => ({
    rowIndex: i,
    title: String(row[colMap["Title"]] ?? ""),
    status: String(row[colMap["Status"]] ?? ""),
    priority: String(row[colMap["Priority"]] ?? ""),
    assignee: String(row[colMap["Assignee"]] ?? ""),
    dueDate: String(row[colMap["Due Date"]] ?? ""),
  })).filter(c => c.title.trim())
}

function deriveStatuses(cards: CardRow[], storedStatuses: string[]): string[] {
  let seen = new Set<string>(storedStatuses)
  let result = [...storedStatuses]
  for (let card of cards) {
    let s = card.status.trim()
    if (s && !seen.has(s)) {
      seen.add(s)
      result.push(s)
    }
  }
  return result.length > 0 ? result : DEFAULT_STATUSES
}

function cardsToRows(cards: CardRow[]): any[][] {
  return cards.map(c => [c.title, c.status, c.priority, c.assignee, c.dueDate])
}

interface BoardData {
  sheetId: number
  name: string
  statuses: string[]
  colors: Record<string, string>
  cards: CardRow[]
  sheet: Sheet
  table: exceljs.Table
}

function cardId(card: CardRow) { return `card-${card.rowIndex}` }

function findContainer(id: string, grouped: Record<string, CardRow[]>, statuses: string[]): string | null {
  if (statuses.includes(id)) return id
  for (let s of statuses) if (grouped[s]?.some(c => cardId(c) === id)) return s
  return null
}

// ── Page ──

export default function KanbanPage() {
  let dispatch = useDispatch<AppDispatch>()
  let [boards, setBoards] = useState<{ sheetId: number; name: string; statuses: string[]; colors: Record<string, string>; cardCount: number }[]>([])
  let [activeBoard, setActiveBoard] = useState<BoardData | null>(null)
  let [createOpen, setCreateOpen] = useState(false)
  let [boardName, setBoardName] = useState("")
  let [loading, setLoading] = useState(true)

  let loadList = useCallback(async () => {
    setLoading(true)
    let sheets = await fetchSheets()
    let list = sheets.filter(isKanbanSheet).map(s => ({ sheetId: s.id!, name: s.name, statuses: getStatuses(s), colors: getColors(s), cardCount: 0 }))
    setBoards(list)
    setLoading(false)
  }, [])

  useEffect(() => { loadList() }, [])

  let openBoard = useCallback(async (sheetId: number) => {
    let sheet = await fetchSheet(sheetId)
    if (!sheet) return
    let table = await readTable(sheet)
    if (!table) return
    let cards = tableToCards(table)
    let statuses = deriveStatuses(cards, getStatuses(sheet))
    let colors = getColors(sheet)
    setActiveBoard({ sheetId, name: sheet.name, statuses, colors, cards, sheet, table })
  }, [])

  let createBoard = async () => {
    if (!boardName.trim()) return
    let name = boardName.trim()
    let wb = new exceljs.Workbook()
    let ws = wb.addWorksheet()
    ws.addTable({ name, ref: "A1", columns: SCHEMA_COLS.map(c => ({ name: c.name, filterButton: true })), rows: [], totalsRow: false })
    let buffer = await wb.xlsx.writeBuffer()
    await dispatch(create_sheet({ name, description: kanbanDescription(DEFAULT_STATUSES), file: Buffer.from(buffer).toString("base64"), rows_info: SCHEMA_COLS.map((c, i) => ({ id: i, name: c.name, type: c.type })) }))
    setBoardName("")
    setCreateOpen(false)
    await loadList()
  }

  let deleteBoard = async (sheetId: number) => {
    try { let channel = new Channel(); await invoke("sheets_control", { payload: { command: "delete", id: sheetId }, channel }) } catch {}
    if (activeBoard?.sheetId === sheetId) setActiveBoard(null)
    setBoards(prev => prev.filter(b => b.sheetId !== sheetId))
  }

  let persistBoard = useCallback(async (board: BoardData) => {
    await writeTable(board.sheet, { ...board.table, rows: cardsToRows(board.cards) } as exceljs.Table, dispatch)
  }, [dispatch])

  let updateCards = useCallback((updater: (cards: CardRow[]) => CardRow[]) => {
    setActiveBoard(prev => {
      if (!prev) return prev
      let next = { ...prev, cards: updater(prev.cards) }
      persistBoard(next)
      return next
    })
  }, [persistBoard])

  let addCard = useCallback((status: string, title: string) => {
    updateCards(cards => [...cards, { rowIndex: cards.length, title, status, priority: "", assignee: "", dueDate: "" }])
  }, [updateCards])

  let updateCard = useCallback((rowIndex: number, patch: Partial<CardRow>) => {
    updateCards(cards => cards.map(c => c.rowIndex === rowIndex ? { ...c, ...patch } : c))
  }, [updateCards])

  let deleteCard = useCallback((rowIndex: number) => {
    updateCards(cards => cards.filter(c => c.rowIndex !== rowIndex).map((c, i) => ({ ...c, rowIndex: i })))
  }, [updateCards])

  let duplicateCard = useCallback((rowIndex: number) => {
    updateCards(cards => {
      let src = cards.find(c => c.rowIndex === rowIndex)
      if (!src) return cards
      return [...cards, { ...src, rowIndex: cards.length, title: src.title + " (copy)" }]
    })
  }, [updateCards])

  let moveCard = useCallback((rowIndex: number, newStatus: string) => {
    updateCards(cards => cards.map(c => c.rowIndex === rowIndex ? { ...c, status: newStatus } : c))
  }, [updateCards])

  let addColumn = useCallback(async (colName: string) => {
    if (!activeBoard) return
    let newStatuses = [...activeBoard.statuses, colName]
    let newDesc = kanbanDescription(newStatuses, activeBoard.colors)
    let updatedSheet: Sheet = { ...activeBoard.sheet, description: newDesc }
    let updatedTable: exceljs.Table = { ...activeBoard.table, rows: cardsToRows(activeBoard.cards) }
    await writeTable(updatedSheet, updatedTable as exceljs.Table, dispatch)
    setActiveBoard(prev => prev ? { ...prev, statuses: newStatuses, sheet: updatedSheet } : prev)
  }, [activeBoard, dispatch])

  let renameColumn = useCallback(async (oldName: string, newName: string) => {
    if (!activeBoard || !newName.trim() || oldName === newName) return
    let name = newName.trim()
    if (activeBoard.statuses.includes(name)) return
    let newStatuses = activeBoard.statuses.map(s => s === oldName ? name : s)
    let newCards = activeBoard.cards.map(c => c.status === oldName ? { ...c, status: name } : c)
    let newColors = { ...activeBoard.colors }
    if (newColors[oldName]) { newColors[name] = newColors[oldName]; delete newColors[oldName] }
    let newDesc = kanbanDescription(newStatuses, newColors)
    let updatedSheet: Sheet = { ...activeBoard.sheet, description: newDesc }
    let updatedTable: exceljs.Table = { ...activeBoard.table, rows: cardsToRows(newCards) }
    await writeTable(updatedSheet, updatedTable as exceljs.Table, dispatch)
    setActiveBoard(prev => prev ? { ...prev, statuses: newStatuses, colors: newColors, cards: newCards, sheet: updatedSheet } : prev)
  }, [activeBoard, dispatch])

  let updateColumnColor = useCallback(async (status: string, color: string) => {
    if (!activeBoard) return
    let newColors = { ...activeBoard.colors, [status]: color }
    let newDesc = kanbanDescription(activeBoard.statuses, newColors)
    let updatedSheet: Sheet = { ...activeBoard.sheet, description: newDesc }
    let updatedTable: exceljs.Table = { ...activeBoard.table, rows: cardsToRows(activeBoard.cards) }
    await writeTable(updatedSheet, updatedTable as exceljs.Table, dispatch)
    setActiveBoard(prev => prev ? { ...prev, colors: newColors, sheet: updatedSheet } : prev)
  }, [activeBoard, dispatch])

  if (activeBoard) {
    return (
      <BoardView
        board={activeBoard}
        onBack={() => { setActiveBoard(null); loadList() }}
        onAddCard={addCard}
        onAddColumn={addColumn}
        onUpdateCard={updateCard}
        onDeleteCard={deleteCard}
        onDuplicateCard={duplicateCard}
        onMoveCard={moveCard}
        onChangeColumnColor={updateColumnColor}
        onRenameColumn={renameColumn}
      />
    )
  }

  return (
    <div>
      <Header>
        <h1 className="text-sm font-medium">Kanban</h1>
        <Button size="sm" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>New board</Button>
      </Header>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="New Board" widthClass="w-80">
        <div className="flex flex-col gap-3 px-6">
          <Input label="Board name" value={boardName} onChange={(e) => setBoardName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") createBoard() }} />
          <Button className="w-full" icon={<IconCheck size={18} />} onClick={createBoard} disabled={!boardName.trim()}>Create</Button>
        </div>
      </Dialog>

      <div className="p-6 pt-22">
        {loading ? (
          <div className="flex items-center justify-center py-32"><span className="text-sm text-support-400">Loading...</span></div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="p-4 rounded-lg bg-hover-subtle border border-border-main"><IconLayoutKanban size={28} className="text-support-500" /></div>
            <div className="text-center">
              <p className="text-sm text-support-300">No boards yet</p>
              <p className="text-xs text-support-500 mt-1">Create a board to start organizing tasks</p>
            </div>
            <Button size="sm" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>Create board</Button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
            {boards.map((board, i) => (
              <motion.div key={board.sheetId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                className="group border border-border-main rounded-lg p-5 flex flex-col gap-3 hover:border-border-strong hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 transition-all duration-200 cursor-pointer"
                onClick={() => openBoard(board.sheetId)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center shrink-0"><IconLayoutKanban size={16} className="text-primary-400" /></div>
                    <span className="text-sm font-semibold text-support-100 truncate">{board.name}</span>
                  </div>
                  <button className="p-1.5 rounded-md text-support-500 hover:text-danger-400 hover:bg-danger-900/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); deleteBoard(board.sheetId) }} aria-label={`Delete ${board.name}`}><IconTrash size={14} /></button>
                </div>
                <span className="text-[11px] text-support-600">{board.statuses.length} columns</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Board View ──

type SortKey = "none" | "priority" | "dueDate" | "assignee" | "title"

const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3, "": 4 }

function sortCards(cards: CardRow[], sortBy: SortKey): CardRow[] {
  if (sortBy === "none") return cards
  let sorted = [...cards]
  sorted.sort((a, b) => {
    if (sortBy === "priority") return (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
    if (sortBy === "dueDate") return (a.dueDate || "9999").localeCompare(b.dueDate || "9999")
    if (sortBy === "assignee") return (a.assignee || "zzz").localeCompare(b.assignee || "zzz")
    if (sortBy === "title") return a.title.localeCompare(b.title)
    return 0
  })
  return sorted
}

function BoardView({
  board, onBack, onAddCard, onAddColumn, onUpdateCard, onDeleteCard, onDuplicateCard, onMoveCard, onChangeColumnColor, onRenameColumn,
}: {
  board: BoardData
  onBack: () => void
  onAddCard: (status: string, title: string) => void
  onAddColumn: (name: string) => void
  onUpdateCard: (rowIndex: number, patch: Partial<CardRow>) => void
  onDeleteCard: (rowIndex: number) => void
  onDuplicateCard: (rowIndex: number) => void
  onMoveCard: (rowIndex: number, newStatus: string) => void
  onChangeColumnColor: (status: string, color: string) => void
  onRenameColumn: (oldName: string, newName: string) => void
}) {
  let [peekCard, setPeekCard] = useState<CardRow | null>(null)
  let [activeCard, setActiveCard] = useState<CardRow | null>(null)
  let [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set())
  let [collapsedCols, setCollapsedCols] = useState<Set<string>>(new Set())
  let [filterPriority, setFilterPriority] = useState("")
  let [filterAssignee, setFilterAssignee] = useState("")
  let [sortBy, setSortBy] = useState<SortKey>("none")
  let [showFilter, setShowFilter] = useState(false)
  let [addColOpen, setAddColOpen] = useState(false)
  let [newColName, setNewColName] = useState("")

  let sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => {
    let handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (peekCard) { setPeekCard(null); return }
        if (showFilter) { setShowFilter(false); return }
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [peekCard, showFilter])

  let allAssignees = useMemo(() => {
    let set = new Set<string>()
    board.cards.forEach(c => { if (c.assignee) set.add(c.assignee) })
    return Array.from(set).sort()
  }, [board.cards])

  let filteredCards = useMemo(() => {
    let cards = board.cards
    if (filterPriority) cards = cards.filter(c => c.priority === filterPriority)
    if (filterAssignee) cards = cards.filter(c => c.assignee === filterAssignee)
    return cards
  }, [board.cards, filterPriority, filterAssignee])

  let grouped = useMemo(() => {
    let map: Record<string, CardRow[]> = {}
    for (let s of board.statuses) map[s] = []
    for (let card of filteredCards) {
      let status = board.statuses.includes(card.status) ? card.status : board.statuses[0]
      ;(map[status] ??= []).push(card)
    }
    if (sortBy !== "none") {
      for (let s of board.statuses) map[s] = sortCards(map[s], sortBy)
    }
    return map
  }, [filteredCards, board.statuses, sortBy])

  let visibleStatuses = board.statuses.filter(s => !hiddenCols.has(s))
  let hiddenStatuses = board.statuses.filter(s => hiddenCols.has(s))
  let hasActiveFilter = filterPriority || filterAssignee

  let handleDragStart = (e: DragStartEvent) => {
    setActiveCard(board.cards.find(c => cardId(c) === String(e.active.id)) ?? null)
  }

  let handleDragOver = (e: DragOverEvent) => {
    if (!e.over) return
    let from = findContainer(String(e.active.id), grouped, board.statuses)
    let to = findContainer(String(e.over.id), grouped, board.statuses)
    if (from && to && from !== to) {
      let card = board.cards.find(c => cardId(c) === String(e.active.id))
      if (card) onMoveCard(card.rowIndex, to)
    }
  }

  let handleDragEnd = (e: DragEndEvent) => {
    setActiveCard(null)
    if (!e.over) return
    let to = findContainer(String(e.over.id), grouped, board.statuses)
    if (!to) return
    let card = board.cards.find(c => cardId(c) === String(e.active.id))
    if (card && card.status !== to) onMoveCard(card.rowIndex, to)
  }

  return (
    <div className="flex h-screen">
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300`}>
        <Header>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm text-support-400 hover:text-support-200 transition-colors cursor-pointer" onClick={onBack}>
              <IconLayoutKanban size={16} />Boards
            </button>
            <span className="text-support-600">/</span>
            <h1 className="text-sm font-medium">{board.name}</h1>
            <span className="text-[10px] text-support-600 tabular-nums">{board.cards.length} cards</span>
          </div>
          <div className="flex items-center gap-1.5">
            {hiddenStatuses.map(s => (
              <button key={s} className="flex items-center gap-1 text-[10px] text-support-400 px-2 py-1 rounded-md bg-hover-subtle hover:bg-hover-strong transition-colors cursor-pointer"
                onClick={() => setHiddenCols(prev => { let n = new Set(prev); n.delete(s); return n })}>
                <span className={`w-1.5 h-1.5 rounded-full ${resolveColor(board.colors, s)}`} />{s}
              </button>
            ))}
            <FilterPopover
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              hasActiveFilter={!!hasActiveFilter}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterAssignee={filterAssignee}
              setFilterAssignee={setFilterAssignee}
              allAssignees={allAssignees}
            />
            <NativeSelect
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              options={[
                { value: "none", label: "No sort" },
                { value: "priority", label: "Priority" },
                { value: "dueDate", label: "Due date" },
                { value: "assignee", label: "Assignee" },
                { value: "title", label: "Title" },
              ]}
            />
          </div>
        </Header>

        <Dialog open={addColOpen} onClose={() => setAddColOpen(false)} title="New Column" widthClass="w-72">
          <div className="flex flex-col gap-3 px-6">
            <Input label="Column name" value={newColName} onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newColName.trim()) { onAddColumn(newColName.trim()); setNewColName(""); setAddColOpen(false) } }} />
            <Button className="w-full" icon={<IconCheck size={16} />} disabled={!newColName.trim()}
              onClick={() => { if (newColName.trim()) { onAddColumn(newColName.trim()); setNewColName(""); setAddColOpen(false) } }}>Add</Button>
          </div>
        </Dialog>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto px-6 pb-6 pt-20">
            <div className="flex gap-4 items-start min-w-max">
              {visibleStatuses.map((status, i) => (
                <motion.div key={status} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }} className="flex">
                  <DropColumn
                    status={status}
                    color={resolveColor(board.colors, status)}
                    cards={grouped[status] ?? []}
                    collapsed={collapsedCols.has(status)}
                    onToggleCollapse={() => setCollapsedCols(prev => {
                      let n = new Set(prev); n.has(status) ? n.delete(status) : n.add(status); return n
                    })}
                    onAddCard={(title) => onAddCard(status, title)}
                    onClickCard={setPeekCard}
                    onHide={() => setHiddenCols(prev => new Set(prev).add(status))}
                    onChangeColor={(c) => onChangeColumnColor(status, c)}
                    onRename={(name) => onRenameColumn(status, name)}
                    activeId={activeCard ? cardId(activeCard) : null}
                  />
                </motion.div>
              ))}

              <button className="flex items-center gap-2 px-4 py-2.5 h-fit rounded-lg text-xs text-support-500 hover:text-support-300 hover:bg-hover-subtle transition-colors cursor-pointer shrink-0"
                onClick={() => setAddColOpen(true)}>
                <IconPlus size={14} />Add column
              </button>
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            <AnimatePresence>
              {activeCard && (
                <motion.div initial={{ scale: 1 }} animate={{ scale: 1.02 }} exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                  <CardContent card={activeCard} isOverlay />
                </motion.div>
              )}
            </AnimatePresence>
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {peekCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setPeekCard(null)}
            />
            <SidePeek
              card={peekCard}
            statuses={board.statuses}
            colors={board.colors}
            onClose={() => setPeekCard(null)}
            onUpdate={(patch) => {
              onUpdateCard(peekCard.rowIndex, patch)
              setPeekCard(prev => prev ? { ...prev, ...patch } : null)
            }}
            onDelete={() => { onDeleteCard(peekCard.rowIndex); setPeekCard(null) }}
            onDuplicate={() => { onDuplicateCard(peekCard.rowIndex) }}
          />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Filter Popover ──

function FilterPopover({
  showFilter, setShowFilter, hasActiveFilter,
  filterPriority, setFilterPriority,
  filterAssignee, setFilterAssignee,
  allAssignees,
}: {
  showFilter: boolean
  setShowFilter: (v: boolean | ((p: boolean) => boolean)) => void
  hasActiveFilter: boolean
  filterPriority: string
  setFilterPriority: (v: string) => void
  filterAssignee: string
  setFilterAssignee: (v: string) => void
  allAssignees: string[]
}) {
  let ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showFilter) return
    let handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowFilter(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showFilter, setShowFilter])

  return (
    <div className="relative" ref={ref}>
      <button
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
          hasActiveFilter ? "text-primary-400 bg-primary-600/10" : "text-support-500 hover:text-support-300 hover:bg-hover-subtle"
        }`}
        onClick={() => setShowFilter(f => !f)}
      >
        <IconFilter size={13} />Filter
        {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
      </button>

      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: EASE }}
            className="absolute right-0 top-full mt-2 w-64 z-[100] rounded-lg border border-border-main bg-dark-900 shadow-xl shadow-black/30 overflow-hidden"
          >
            <div className="px-3 py-2.5 border-b border-border-main/50 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-support-400 uppercase tracking-wider">Filters</span>
              {hasActiveFilter && (
                <button className="text-[10px] text-primary-400 hover:text-primary-300 cursor-pointer"
                  onClick={() => { setFilterPriority(""); setFilterAssignee("") }}>
                  Clear all
                </button>
              )}
            </div>

            <div className="p-3 flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-support-500 font-medium mb-1.5 block">Priority</label>
                <div className="flex flex-wrap gap-1">
                  {[{ value: "", label: "All" }, ...PRIORITIES.filter(p => p.value)].map(p => (
                    <button
                      key={p.value}
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors cursor-pointer ${
                        filterPriority === p.value
                          ? "border-primary-500/40 bg-primary-600/10 text-primary-400"
                          : "border-border-main/50 text-support-400 hover:text-support-200 hover:border-border-main"
                      }`}
                      onClick={() => setFilterPriority(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {allAssignees.length > 0 && (
                <div>
                  <label className="text-[10px] text-support-500 font-medium mb-1.5 block">Assignee</label>
                  <div className="flex flex-wrap gap-1">
                    <button
                      className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors cursor-pointer ${
                        !filterAssignee
                          ? "border-primary-500/40 bg-primary-600/10 text-primary-400"
                          : "border-border-main/50 text-support-400 hover:text-support-200 hover:border-border-main"
                      }`}
                      onClick={() => setFilterAssignee("")}
                    >
                      All
                    </button>
                    {allAssignees.map(a => (
                      <button
                        key={a}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-md border transition-colors cursor-pointer ${
                          filterAssignee === a
                            ? "border-primary-500/40 bg-primary-600/10 text-primary-400"
                            : "border-border-main/50 text-support-400 hover:text-support-200 hover:border-border-main"
                        }`}
                        onClick={() => setFilterAssignee(a)}
                      >
                        <span className="w-4 h-4 rounded-full bg-primary-600/15 text-[8px] font-bold text-primary-300 uppercase inline-flex items-center justify-center">
                          {a.charAt(0)}
                        </span>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Column ──

function DropColumn({
  status, color, cards, collapsed, onToggleCollapse, onAddCard, onClickCard, onHide, onChangeColor, onRename, activeId,
}: {
  status: string; color: string; cards: CardRow[]; collapsed: boolean; onToggleCollapse: () => void; onAddCard: (title: string) => void; onClickCard: (card: CardRow) => void; onHide: () => void; onChangeColor: (color: string) => void; onRename: (name: string) => void; activeId: string | null
}) {
  let { isOver, setNodeRef } = useDroppable({ id: status })
  let ids = useMemo(() => cards.map(c => cardId(c)), [cards])
  let [adding, setAdding] = useState(false)
  let [draft, setDraft] = useState("")
  let [menuOpen, setMenuOpen] = useState(false)
  let [colorPickerOpen, setColorPickerOpen] = useState(false)
  let [renaming, setRenaming] = useState(false)
  let [renameDraft, setRenameDraft] = useState("")
  let inputRef = useRef<HTMLInputElement>(null)
  let renameRef = useRef<HTMLInputElement>(null)
  let menuRef = useRef<HTMLDivElement>(null)
  let colorRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (adding) inputRef.current?.focus() }, [adding])
  useEffect(() => { if (renaming) { renameRef.current?.focus(); renameRef.current?.select() } }, [renaming])

  let commitRename = () => {
    let name = renameDraft.trim()
    if (name && name !== status) onRename(name)
    setRenaming(false)
  }
  useEffect(() => {
    if (!menuOpen) return
    let handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen])

  useEffect(() => {
    if (!colorPickerOpen) return
    let handler = (e: MouseEvent) => { if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorPickerOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [colorPickerOpen])

  let commit = () => {
    if (draft.trim()) { onAddCard(draft.trim()); setDraft("") }
    setAdding(false)
  }

  let dotColor = color

  if (collapsed) {
    return (
      <div ref={setNodeRef}
        className={`flex flex-col items-center w-10 shrink-0 rounded-lg py-3 cursor-pointer transition-all duration-200 hover:bg-hover-subtle/50 ${isOver ? "bg-primary-600/5 ring-1 ring-primary-500/30" : ""}`}
        onClick={onToggleCollapse}
      >
        <span className={`w-2 h-2 rounded-full ${dotColor} mb-2`} />
        <span className="text-[10px] text-support-600 tabular-nums mb-2">{cards.length}</span>
        <span className="text-[10px] font-semibold text-support-500 uppercase tracking-wider [writing-mode:vertical-lr] rotate-180">{status}</span>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} className={`flex flex-col w-[17rem] shrink-0 rounded-lg transition-all duration-200 max-h-[calc(100vh-8rem)] ${isOver ? "bg-primary-600/5 ring-1 ring-primary-500/30" : ""}`}>
      <div className="relative flex items-center justify-between px-3 py-2.5 group/header">
        <div className="flex items-center gap-2">
          <button className="p-0.5 rounded text-support-600 hover:text-support-300 transition-colors cursor-pointer" onClick={onToggleCollapse} aria-label="Collapse">
            <IconChevronDown size={12} />
          </button>
          <span className={`w-2 h-2 rounded-full ${dotColor} transition-transform duration-200 ${isOver ? "scale-150" : ""}`} />
          {renaming ? (
            <input
              ref={renameRef}
              className="text-xs font-semibold text-support-200 uppercase tracking-wider bg-transparent outline-none border-b border-primary-500/50 py-0 w-24"
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(false) }}
              onBlur={commitRename}
            />
          ) : (
            <span
              className="text-xs font-semibold text-support-400 uppercase tracking-wider cursor-default"
              onDoubleClick={() => { setRenameDraft(status); setRenaming(true) }}
            >{status}</span>
          )}
          <span className="text-[10px] text-support-600 tabular-nums">{cards.length}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 rounded text-support-600 hover:text-support-300 hover:bg-hover-strong transition-colors cursor-pointer" onClick={() => setAdding(true)} aria-label="Add card">
            <IconPlus size={14} />
          </button>
          <div className="relative" ref={menuRef}>
            <button className="p-1 rounded text-support-600 opacity-0 group-hover/header:opacity-100 hover:text-support-300 hover:bg-hover-strong transition-all cursor-pointer"
              onClick={() => setMenuOpen(o => !o)} aria-label="Column menu"><IconDots size={14} /></button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.12, ease: EASE }}
                  className="absolute right-0 top-full mt-1 w-36 z-50 rounded-lg border border-border-main bg-dark-900 shadow-xl shadow-black/30 py-1"
                >
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-support-300 hover:bg-hover-subtle transition-colors cursor-pointer"
                    onClick={() => { setMenuOpen(false); setRenameDraft(status); setRenaming(true) }}>
                    <IconPencil size={13} />Rename
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-support-300 hover:bg-hover-subtle transition-colors cursor-pointer"
                    onClick={() => { setMenuOpen(false); setColorPickerOpen(true) }}>
                    <IconPalette size={13} />Change color
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-support-300 hover:bg-hover-subtle transition-colors cursor-pointer"
                    onClick={() => { onHide(); setMenuOpen(false) }}>
                    <IconEyeOff size={13} />Hide column
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-support-300 hover:bg-hover-subtle transition-colors cursor-pointer"
                    onClick={() => { onToggleCollapse(); setMenuOpen(false) }}>
                    <IconChevronRight size={13} />Collapse
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {colorPickerOpen && (
              <motion.div
                ref={colorRef}
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97, transition: { duration: 0.1 } }}
                transition={{ duration: 0.12, ease: EASE }}
                className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-border-main bg-dark-900 shadow-xl shadow-black/30 p-3"
              >
                <p className="text-[10px] text-support-500 font-medium mb-2.5 px-0.5">Column color</p>
                <div className="grid grid-cols-6 gap-2">
                  {COLUMN_COLOR_PRESETS.map(preset => (
                    <button
                      key={preset.value}
                      className={`w-6 h-6 rounded-md ${preset.value} transition-all duration-150 cursor-pointer ring-offset-2 ring-offset-dark-900 ${
                        color === preset.value ? "ring-2 ring-white/60 scale-110" : "hover:scale-115 active:scale-95"
                      }`}
                      onClick={() => { onChangeColor(preset.value); setColorPickerOpen(false) }}
                      title={preset.label}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 flex flex-col gap-1.5 min-h-[3rem]">
          <AnimatePresence mode="popLayout">
            {cards.map((card, i) => (
              <SortableCard key={cardId(card)} card={card} index={i} isDragging={activeId === cardId(card)} onClick={() => onClickCard(card)} />
            ))}
          </AnimatePresence>

          {adding && (
            <div className="rounded-lg border border-primary-500/40 bg-dark-900 p-2">
              <input ref={inputRef} className="w-full bg-transparent text-sm outline-none text-support-100 placeholder:text-support-500"
                placeholder="Card title..." value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onAddCard(draft.trim()); setDraft("") } if (e.key === "Escape") { setAdding(false); setDraft("") } }}
                onBlur={commit} />
            </div>
          )}
        </div>
      </SortableContext>

      {!adding && (
        <button className="mx-1.5 mb-1.5 flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] text-support-600 hover:text-support-400 hover:bg-hover-subtle/50 transition-colors cursor-pointer"
          onClick={() => setAdding(true)}>
          <IconPlus size={13} />New
        </button>
      )}
    </div>
  )
}

// ── Sortable Card ──

function SortableCard({ card, index, isDragging, onClick }: { card: CardRow; index: number; isDragging: boolean; onClick: () => void }) {
  let { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cardId(card) })
  return (
    <motion.div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes} {...listeners} onClick={onClick} layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: isDragging ? 0.2 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
      transition={{ duration: 0.15, delay: index * 0.015, ease: EASE }}>
      <CardContent card={card} />
    </motion.div>
  )
}

// ── Card Content ──

function CardContent({ card, isOverlay }: { card: CardRow; isOverlay?: boolean }) {
  let priorityClass = PRIORITY_COLORS[card.priority] ?? ""
  let hasMeta = card.priority || card.dueDate || card.assignee

  return (
    <div className={`flex flex-col rounded-md border transition-all duration-150 ${
      isOverlay
        ? "border-primary-500/50 bg-dark-800 shadow-2xl shadow-black/30 w-[16rem]"
        : "border-border-main/60 bg-dark-900 hover:bg-dark-800/60 cursor-pointer"
    }`}>
      <div className="px-3 pt-2.5 pb-1.5">
        <span className="text-[13px] text-support-100 min-w-0 break-words leading-snug">{card.title}</span>
      </div>
      {hasMeta && (
        <div className="flex items-center gap-1.5 flex-wrap px-3 pb-2.5">
          {card.priority && (
            <span className={`text-[10px] px-1.5 py-px rounded font-medium ${priorityClass}`}>{card.priority}</span>
          )}
          {card.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-support-500">
              <IconCalendar size={10} />{card.dueDate}
            </span>
          )}
          {card.assignee && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600/15 text-[9px] font-bold text-primary-300 uppercase" title={card.assignee}>
              {card.assignee.charAt(0)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Side Peek (Notion-style) ──

function SidePeek({
  card, statuses, colors, onClose, onUpdate, onDelete, onDuplicate,
}: {
  card: CardRow; statuses: string[]; colors: Record<string, string>; onClose: () => void; onUpdate: (patch: Partial<CardRow>) => void; onDelete: () => void; onDuplicate?: () => void
}) {
  let statusDot = resolveColor(colors, card.status)
  let priorityClass = PRIORITY_COLORS[card.priority] ?? ""

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: EASE }}
      className="w-[26rem] shrink-0 border-l border-border-main bg-dark-900 flex flex-col h-full overflow-hidden z-50 relative"
    >
      <div className="flex items-center justify-between px-5 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${statusDot} shrink-0 ring-2 ring-dark-900`} />
          <span className="text-[11px] font-medium text-support-400 uppercase tracking-wider truncate">{card.status}</span>
        </div>
        <div className="flex items-center gap-1">
          {onDuplicate && (
            <button className="p-1.5 rounded-md text-support-600 hover:text-support-300 hover:bg-hover-strong transition-colors cursor-pointer"
              onClick={onDuplicate} aria-label="Duplicate" title="Duplicate">
              <IconCopy size={13} />
            </button>
          )}
          <button className="p-1.5 rounded-md text-support-600 hover:text-danger-400 hover:bg-danger-900/15 transition-colors cursor-pointer"
            onClick={onDelete} aria-label="Delete" title="Delete">
            <IconTrash size={13} />
          </button>
          <div className="w-px h-4 bg-border-main/50 mx-1" />
          <button className="p-1.5 rounded-md text-support-500 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
            onClick={onClose} aria-label="Close">
            <IconX size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-4 pb-5">
          <input
            className="text-lg font-semibold bg-transparent outline-none w-full placeholder:text-support-500 text-support-100 leading-snug border-b border-transparent focus:border-border-main pb-2 transition-colors"
            value={card.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Untitled"
          />
        </div>

        <div className="px-5">
          <p className="text-[10px] font-semibold text-support-600 uppercase tracking-wider px-1 mb-2">Properties</p>
          <div className="rounded-lg border border-border-main/40 divide-y divide-border-main/40 overflow-hidden">
            <PropertyRow icon={<span className={`w-2 h-2 rounded-full ${statusDot}`} />} label="Status">
              <NativeSelect size="sm" value={card.status} onChange={(e) => onUpdate({ status: e.target.value })} options={statuses.map(s => ({ label: s, value: s }))} />
            </PropertyRow>

            <PropertyRow icon={<IconFlag3 size={12} />} label="Priority">
              <div className="flex items-center gap-2">
                <NativeSelect size="sm" value={card.priority} onChange={(e) => onUpdate({ priority: e.target.value })} options={PRIORITIES} />
                {card.priority && <span className={`text-[9px] px-1.5 py-px rounded font-semibold shrink-0 ${priorityClass}`}>{card.priority}</span>}
              </div>
            </PropertyRow>

            <PropertyRow icon={<IconUser size={12} />} label="Assignee">
              <Input size="sm" value={card.assignee} onChange={(e) => onUpdate({ assignee: e.target.value })} placeholder="Add assignee..." />
            </PropertyRow>

            <PropertyRow icon={<IconCalendar size={12} />} label="Due date">
              <DatePicker size="sm" value={card.dueDate} onChange={(val) => onUpdate({ dueDate: val })} placeholder="Set date" clearable />
            </PropertyRow>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PropertyRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center py-2.5 px-3 gap-3 hover:bg-hover-subtle/20 transition-colors">
      <div className="w-24 shrink-0 flex items-center gap-2 text-[11px] text-support-500 font-medium">
        <span className="text-support-600">{icon}</span>
        {label}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
