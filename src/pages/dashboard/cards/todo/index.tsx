import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../../contexts/store"
import { update_card } from "../../../../contexts/dashboard/functions/card/update"
import { useState, useRef } from "react"
import {
  IconCheck,
  IconPlus,
  IconTrash,
  IconCheckbox,
  IconSettings,
} from "@tabler/icons-react"
import { Dialog } from "../../../../components/Dialog"
import Input from "../../../../components/input"

interface TodoItem {
  id: string
  text: string
  done: boolean
}

function genId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function TodoCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]

  const todos: TodoItem[] = card?.store?.todos ?? []
  const label = card?.store?.label ?? ""

  const [draft, setDraft] = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateTodos = (next: TodoItem[]) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, todos: next } },
    }))
  }

  const updateLabel = (val: string) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, label: val } },
    }))
  }

  const addTodo = () => {
    const text = draft.trim()
    if (!text) return
    updateTodos([...todos, { id: genId(), text, done: false }])
    setDraft("")
    inputRef.current?.focus()
  }

  const toggleTodo = (todoId: string) => {
    updateTodos(todos.map(t => t.id === todoId ? { ...t, done: !t.done } : t))
  }

  const removeTodo = (todoId: string) => {
    updateTodos(todos.filter(t => t.id !== todoId))
  }

  const doneCount = todos.filter(t => t.done).length
  const total = todos.length
  const progress = total > 0 ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="flex flex-col h-full group/card">
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Todo Settings" widthClass="w-80">
        <div className="flex flex-col gap-3 px-6">
          <Input
            label="Card title"
            value={label}
            onChange={(e) => updateLabel(e.target.value)}
            placeholder="My tasks"
          />
        </div>
      </Dialog>

      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
          {label || "To-do"}
        </span>
        <div className="flex items-center gap-1">
          {total > 0 && (
            <span className="text-[10px] text-support-600 tabular-nums">
              {doneCount}/{total}
            </span>
          )}
          <button
            className="p-1.5 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-strong focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none cursor-pointer"
            onClick={() => setSettingsOpen(true)}
            aria-label="Card settings"
          >
            <IconSettings size={14} />
          </button>
        </div>
      </div>

      {total > 0 && (
        <div className="px-4 pb-2">
          <div className="h-1 rounded-full bg-hover-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 min-h-0">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
            <IconCheckbox size={24} className="text-support-600" />
            <p className="text-xs text-support-500">No tasks yet</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {todos.map(todo => (
              <li
                key={todo.id}
                className="group/item flex items-center gap-2 px-2 py-1.5 rounded-md border border-border-main hover:border-border-strong hover:bg-hover-subtle transition-colors"
              >
                <button
                  className={`flex items-center justify-center w-[18px] h-[18px] rounded border shrink-0 transition-colors cursor-pointer ${
                    todo.done
                      ? "border-primary-600 bg-primary-600"
                      : "border-border-strong bg-transparent hover:border-primary-600/50"
                  }`}
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.done ? `Uncheck ${todo.text}` : `Check ${todo.text}`}
                >
                  {todo.done && <IconCheck size={12} className="text-white" />}
                </button>
                <span className={`flex-1 text-sm min-w-0 truncate transition-colors ${
                  todo.done ? "text-support-500 line-through" : "text-support-200"
                }`}>
                  {todo.text}
                </span>
                <button
                  className="p-1 rounded text-support-600 opacity-0 group-hover/item:opacity-100 hover:text-danger-400 hover:bg-danger-900/20 transition-all cursor-pointer"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Remove ${todo.text}`}
                >
                  <IconTrash size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-3 pb-3 pt-2 border-t border-border-subtle mt-auto">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-support-500 text-support-100"
            placeholder="Add a task..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTodo() }}
          />
          <button
            className="p-1.5 rounded-md text-support-500 hover:text-primary-400 hover:bg-hover-strong transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            onClick={addTodo}
            disabled={!draft.trim()}
            aria-label="Add task"
          >
            <IconPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
