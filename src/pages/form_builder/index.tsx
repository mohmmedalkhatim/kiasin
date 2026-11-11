import { useState, useCallback, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Channel, invoke } from "@tauri-apps/api/core"
import type { AppDispatch, RootState } from "../../contexts/store"
import { forms } from "../../contexts/forms"
import { create_form } from "../../contexts/forms/functions/create"
import { list_forms } from "../../contexts/forms/functions/list"
import { update_form } from "../../contexts/forms/functions/update"
import { delete_form } from "../../contexts/forms/functions/delete"
import type { FormDef, FormField, FieldType, FormLayout } from "../../contexts/forms"
import type { Sheet } from "../../contexts/sheets/objects"
import Header from "../../components/header"
import Button from "../../components/Button"
import Input from "../../components/input"
import { Dialog } from "../../components/Dialog"
import NativeSelect from "../../components/native-select"
import NumberInput from "../../components/number-input"
import DatePicker from "../../components/datepicker"
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconForms,
  IconCheck,
  IconCopy,
  IconEye,
  IconColumns2,
  IconColumnInsertRight,
  IconChevronUp,
  IconChevronDown,
  IconArrowLeft,
  IconSend,
  IconX,
  IconTable,
  IconTextSize,
  IconHash,
  IconMail,
  IconCalendar,
  IconSelector,
  IconAlignLeft,
  IconCheckbox,
} from "@tabler/icons-react"

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
]

const FORM_LAYOUTS: { value: FormLayout; label: string }[] = [
  { value: "basic", label: "Basic" },
  { value: "inline", label: "Inline" },
  { value: "grid", label: "Grid" },
  { value: "block", label: "Block" },
  { value: "horizontal", label: "Horizontal" },
  { value: "nolabel", label: "No Labels" },
]

const FIELD_TYPE_ICONS: Record<FieldType, typeof IconTextSize> = {
  text: IconTextSize,
  number: IconHash,
  email: IconMail,
  date: IconCalendar,
  select: IconSelector,
  textarea: IconAlignLeft,
  checkbox: IconCheckbox,
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function sheetTypeToFieldType(type: string): FieldType {
  switch (type) {
    case "number": return "number"
    case "boolean": return "checkbox"
    case "date": return "date"
    default: return "text"
  }
}

function parseSheetColumns(sheet: Sheet): { name: string; type: string }[] {
  if (sheet.description) {
    try {
      let parsed = JSON.parse(sheet.description)
      if (Array.isArray(parsed)) return parsed
      if (parsed?.columns && Array.isArray(parsed.columns)) return parsed.columns
    } catch {}
  }
  return []
}

function sheetToFormFields(sheet: Sheet): FormField[] {
  return parseSheetColumns(sheet).map(col => ({
    id: generateId(),
    label: col.name,
    type: sheetTypeToFieldType(col.type),
    placeholder: `Enter ${col.name.toLowerCase()}`,
    required: false,
    options: [],
    colSpan: 1,
  }))
}

function newField(): FormField {
  return {
    id: generateId(),
    label: "",
    type: "text",
    placeholder: "",
    required: false,
    options: [],
    colSpan: 1,
  }
}

function FormBuilder() {
  let dispatch = useDispatch<AppDispatch>()
  let { list: formsList, active: activeForm } = useSelector((s: RootState) => s.forms)
  let [createOpen, setCreateOpen] = useState(false)
  let [generateOpen, setGenerateOpen] = useState(false)
  let [formName, setFormName] = useState("")
  let [previewOpen, setPreviewOpen] = useState(false)
  let [dragFrom, setDragFrom] = useState<number | null>(null)
  let [dragOver, setDragOver] = useState<number | null>(null)

  useEffect(() => {
    dispatch(list_forms())
  }, [])

  let generateFromSheet = (sheet: Sheet) => {
    let form: FormDef = {
      id: generateId(),
      name: sheet.name,
      layout: "basic",
      fields: sheetToFormFields(sheet),
      createdAt: new Date().toISOString(),
    }
    dispatch(create_form(form))
    dispatch(forms.actions.set_active(form))
    setGenerateOpen(false)
  }

  let createForm = () => {
    if (!formName.trim()) return
    let form: FormDef = {
      id: generateId(),
      name: formName.trim(),
      layout: "basic",
      fields: [newField()],
      createdAt: new Date().toISOString(),
    }
    dispatch(create_form(form))
    dispatch(forms.actions.set_active(form))
    setFormName("")
    setCreateOpen(false)
  }

  let updateActiveForm = useCallback((updater: (f: FormDef) => FormDef) => {
    if (!activeForm) return
    let next = updater(activeForm)
    dispatch(update_form(next))
  }, [activeForm, dispatch])

  let addField = () => {
    updateActiveForm(f => ({ ...f, fields: [...f.fields, newField()] }))
  }

  let removeField = (fieldId: string) => {
    updateActiveForm(f => ({ ...f, fields: f.fields.filter(fi => fi.id !== fieldId) }))
  }

  let updateField = (fieldId: string, patch: Partial<FormField>) => {
    updateActiveForm(f => ({
      ...f,
      fields: f.fields.map(fi => fi.id === fieldId ? { ...fi, ...patch } : fi),
    }))
  }

  let handleDeleteForm = (formId: string) => {
    dispatch(delete_form(formId))
  }

  let duplicateForm = (form: FormDef) => {
    let copy: FormDef = {
      ...form,
      id: generateId(),
      name: form.name + " (copy)",
      layout: form.layout ?? "basic",
      fields: form.fields.map(f => ({ ...f, id: generateId() })),
      createdAt: new Date().toISOString(),
    }
    dispatch(create_form(copy))
    dispatch(forms.actions.set_active(copy))
  }

  let moveField = (from: number, to: number) => {
    if (from === to) return
    updateActiveForm(f => {
      let fields = [...f.fields]
      let [moved] = fields.splice(from, 1)
      fields.splice(to, 0, moved)
      return { ...f, fields }
    })
  }

  let handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragFrom(idx)
    e.dataTransfer.effectAllowed = "move"
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.4"
  }

  let handleDragEnd = (e: React.DragEvent) => {
    setDragFrom(null)
    setDragOver(null)
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = ""
  }

  let handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(idx)
  }

  let handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    if (dragFrom !== null && dragFrom !== toIdx) moveField(dragFrom, toIdx)
    setDragFrom(null)
    setDragOver(null)
  }

  if (activeForm) {
    return (
      <>
        <main className="relative">
          <Header>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1.5 text-sm text-support-400 hover:text-support-200 transition-colors cursor-pointer"
                onClick={() => dispatch(forms.actions.clear_active())}
                aria-label="Back to forms list"
              >
                <IconArrowLeft size={16} />
                Forms
              </button>
              <span className="text-support-600">/</span>
              <h1 className="text-sm font-medium">{activeForm.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outlined" size="sm" icon={<IconEye size={16} />} onClick={() => setPreviewOpen(true)}>
                Preview
              </Button>
              <Button size="sm" icon={<IconPlus size={16} />} onClick={addField}>
                Add field
              </Button>
            </div>
          </Header>

          <div className="pt-18 max-w-3xl mx-auto">
            <div className="px-6 py-3 flex items-center justify-between border-b border-border-main/50">
              <span className="text-[11px] font-semibold text-support-500 uppercase tracking-wider">Layout</span>
              <div className="flex items-center gap-1 bg-hover-subtle/50 rounded-lg p-0.5">
                {FORM_LAYOUTS.map(l => (
                  <button
                    key={l.value}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all duration-150 cursor-pointer ${
                      (activeForm.layout ?? "basic") === l.value
                        ? "bg-dark-900 text-support-100 shadow-sm"
                        : "text-support-500 hover:text-support-300"
                    }`}
                    onClick={() => updateActiveForm(f => ({ ...f, layout: l.value }))}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-support-500 uppercase tracking-wider">
                  Fields ({activeForm.fields.length})
                </span>
              </div>

              {activeForm.fields.length === 0 ? (
                <EmptyFields onAdd={addField} />
              ) : (
                <div className="flex flex-col gap-2">
                  {activeForm.fields.map((field, idx) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      index={idx}
                      total={activeForm.fields.length}
                      dragOver={dragOver === idx && dragFrom !== idx}
                      onUpdate={(patch) => updateField(field.id, patch)}
                      onRemove={() => removeField(field.id)}
                      onMoveUp={() => moveField(idx, idx - 1)}
                      onMoveDown={() => moveField(idx, idx + 1)}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={activeForm.name}
          description={`${activeForm.fields.length} field${activeForm.fields.length !== 1 ? "s" : ""}${activeForm.fields.some(f => f.required) ? " · Fields marked * are required" : ""}`}
          widthClass="w-[40rem]"
          panelClassName="max-h-[min(85vh,48rem)] flex flex-col"
          bodyClassName="!py-0 flex-1 overflow-hidden flex flex-col"
        >
          {activeForm.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 gap-2">
              <IconForms size={24} className="text-support-600" />
              <p className="text-sm text-support-500">No fields to preview</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <FormLayoutPreview layout={activeForm.layout ?? "basic"} fields={activeForm.fields} />
              </div>

              <div className="shrink-0 px-6 py-4 border-t border-border-main">
                <Button icon={<IconSend size={16} />} className="w-full">
                  Submit
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </>
    )
  }

  return (
    <div>
      <Header>
        <h1 className="text-sm font-medium">Forms</h1>
        <div className="flex items-center gap-2">
          <Button variant="outlined" size="sm" icon={<IconTable size={16} />} onClick={() => setGenerateOpen(true)}>
            Generate from sheet
          </Button>
          <Button size="sm" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>
            New form
          </Button>
        </div>
      </Header>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="New Form" widthClass="w-80">
        <div className="flex flex-col gap-3 px-6">
          <Input
            label="Form name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") createForm() }}
          />
          <Button className="w-full" icon={<IconCheck size={18} />} onClick={createForm} disabled={!formName.trim()}>
            Create
          </Button>
        </div>
      </Dialog>

      <GenerateFromSheetDialog
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onSelect={generateFromSheet}
      />

      <div className="p-6 pt-22">
        {formsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="p-4 rounded-lg bg-hover-subtle border border-border-main">
              <IconForms size={28} className="text-support-500" />
            </div>
            <div className="text-center">
              <p className="text-sm text-support-300">No forms yet</p>
              <p className="text-xs text-support-500 mt-1">Create a form to start collecting data</p>
            </div>
            <Button size="sm" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>
              Create form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3">
            {formsList.map(form => (
              <FormCard
                key={form.id}
                form={form}
                onSelect={() => dispatch(forms.actions.set_active(form))}
                onDuplicate={() => duplicateForm(form)}
                onDelete={() => handleDeleteForm(form.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GenerateFromSheetDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (sheet: Sheet) => void
}) {
  let [sheets, setSheets] = useState<Sheet[]>([])
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    let channel = new Channel<Sheet[]>((res) => {
      setSheets(res)
      setLoading(false)
    })
    invoke("sheets_control", { payload: { command: "list" }, channel }).catch(() => setLoading(false))
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} title="Generate from sheet" widthClass="w-96">
      <div className="px-6 pb-2">
        <p className="text-xs text-support-500 mb-4">
          Pick a sheet to auto-generate a form from its columns.
        </p>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-support-400">Loading sheets...</span>
          </div>
        ) : sheets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <IconTable size={24} className="text-support-600" />
            <p className="text-sm text-support-500">No sheets found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
            {sheets.map(sheet => (
              <button
                key={sheet.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-hover-subtle transition-colors cursor-pointer group"
                onClick={() => onSelect(sheet)}
              >
                <IconTable size={16} className="text-support-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{sheet.name}</span>
                  <span className="text-[11px] text-support-500">
                    {parseSheetColumns(sheet).length} column{parseSheetColumns(sheet).length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs text-support-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Generate
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  )
}

function EmptyFields({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="p-4 rounded-lg bg-hover-subtle border border-border-main">
        <IconForms size={28} className="text-support-500" />
      </div>
      <div className="text-center">
        <p className="text-sm text-support-300">No fields yet</p>
        <p className="text-xs text-support-500 mt-1">Add fields to build your form</p>
      </div>
      <Button size="sm" icon={<IconPlus size={16} />} onClick={onAdd}>
        Add first field
      </Button>
    </div>
  )
}

function FormCard({
  form,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  form: FormDef
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="group border border-border-main rounded-lg p-4 flex flex-col gap-3 hover:border-border-strong transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">{form.name}</span>
          <span className="text-[11px] text-support-500 mt-0.5 flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-hover-subtle text-support-400 text-[10px]">{form.layout ?? "basic"}</span>
            {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            className="p-1.5 rounded-md text-support-500 hover:text-support-200 hover:bg-hover-strong transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            aria-label={`Duplicate ${form.name}`}
          >
            <IconCopy size={14} />
          </button>
          <button
            className="p-1.5 rounded-md text-support-500 hover:text-danger-400 hover:bg-danger-900/20 transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            aria-label={`Delete ${form.name}`}
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {form.fields.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {form.fields.slice(0, 4).map(f => (
            <span key={f.id} className="text-[11px] px-1.5 py-0.5 rounded-md bg-hover-subtle border border-border-main text-support-400 truncate max-w-[8rem]">
              {f.label || f.type}
            </span>
          ))}
          {form.fields.length > 4 && (
            <span className="text-[11px] text-support-500 self-center">+{form.fields.length - 4}</span>
          )}
        </div>
      )}
    </div>
  )
}

function FieldCard({
  field,
  index,
  total,
  dragOver,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  field: FormField
  index: number
  total: number
  dragOver: boolean
  onUpdate: (patch: Partial<FormField>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const fieldName = field.label || `Field ${index + 1}`
  const TypeIcon = FIELD_TYPE_ICONS[field.type] ?? IconTextSize
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group rounded-lg border transition-all duration-150 ${
        dragOver
          ? "border-primary-500 bg-primary-600/5 shadow-sm shadow-primary-500/10"
          : "border-border-main hover:border-border-strong"
      }`}
    >
      <div className="flex items-center gap-2 px-2 py-2">
        <span className="cursor-grab active:cursor-grabbing text-support-600 hover:text-support-400 transition-colors p-1 shrink-0">
          <IconGripVertical size={14} />
        </span>

        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-hover-subtle shrink-0">
          <TypeIcon size={14} className="text-support-400" />
        </div>

        <input
          className="flex-1 min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-support-500"
          placeholder="Field label"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          aria-label="Field label"
        />

        <div className="flex items-center gap-1 shrink-0">
          {field.required && (
            <span className="text-[9px] font-bold text-danger-400 bg-danger-500/10 px-1.5 py-0.5 rounded">REQ</span>
          )}
          {field.colSpan === 2 && (
            <span className="text-[9px] font-bold text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">FULL</span>
          )}
          <span className="text-[10px] text-support-500 px-1">{field.type}</span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 rounded-md text-support-600 hover:text-support-200 hover:bg-hover-strong disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={`Move ${fieldName} up`}
          >
            <IconChevronUp size={13} />
          </button>
          <button
            className="p-1 rounded-md text-support-600 hover:text-support-200 hover:bg-hover-strong disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label={`Move ${fieldName} down`}
          >
            <IconChevronDown size={13} />
          </button>
          <button
            className="p-1 rounded-md text-support-600 hover:text-danger-400 hover:bg-danger-900/20 transition-colors cursor-pointer"
            onClick={onRemove}
            aria-label={`Delete ${fieldName}`}
          >
            <IconTrash size={13} />
          </button>
        </div>

        <button
          className="p-1 rounded-md text-support-600 hover:text-support-300 hover:bg-hover-strong transition-colors cursor-pointer shrink-0"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <IconChevronDown size={14} className={`transition-transform duration-150 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border-subtle/50 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <NativeSelect
              size="sm"
              label="Type"
              value={field.type}
              onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
              options={FIELD_TYPES}
            />
            <Input
              size="sm"
              label="Placeholder"
              placeholder="Placeholder text"
              value={field.placeholder}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
            />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 h-9 px-2 rounded-md text-xs text-support-400 cursor-pointer select-none hover:bg-hover-subtle transition-colors">
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                    field.required
                      ? "border-primary-600 bg-primary-600"
                      : "border-support-500 bg-transparent"
                  }`}
                >
                  {field.required && <IconCheck size={11} className="text-white" />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={field.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                />
                Required
              </label>
              <button
                className={`h-9 px-2 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  field.colSpan === 2
                    ? "text-primary-400 bg-primary-600/10"
                    : "text-support-500 hover:text-support-300 hover:bg-hover-subtle"
                }`}
                onClick={() => onUpdate({ colSpan: field.colSpan === 1 ? 2 : 1 })}
              >
                {field.colSpan === 1 ? <IconColumns2 size={13} /> : <IconColumnInsertRight size={13} />}
                {field.colSpan === 1 ? "Half" : "Full"}
              </button>
            </div>
          </div>

          {field.type === "select" && (
            <OptionsTagInput
              options={field.options}
              onChange={(opts) => onUpdate({ options: opts })}
            />
          )}
        </div>
      )}
    </div>
  )
}

function OptionsTagInput({
  options,
  onChange,
}: {
  options: string[]
  onChange: (opts: string[]) => void
}) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const commit = () => {
    const val = draft.trim()
    if (val && !options.includes(val)) {
      onChange([...options, val])
    }
    setDraft("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      commit()
    }
    if (e.key === "Backspace" && draft === "" && options.length > 0) {
      onChange(options.slice(0, -1))
    }
  }

  const remove = (idx: number) => {
    onChange(options.filter((_, i) => i !== idx))
  }

  return (
    <div className="relative">
      <label className="absolute -top-2 left-3 px-1 bg-dark-900 z-[1] text-[11px] font-medium text-support-400">
        Options
      </label>
      <div
        className="flex flex-wrap items-center gap-1.5 min-h-9 rounded-lg border border-border-main hover:border-border-strong focus-within:border-primary-600 transition-colors duration-150 px-2.5 py-1.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {options.map((opt, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-xs bg-hover-subtle border border-border-main rounded-md px-2 py-0.5 text-support-200"
          >
            {opt}
            <button
              type="button"
              className="text-support-500 hover:text-support-200 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); remove(i) }}
              aria-label={`Remove ${opt}`}
            >
              <IconX size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="flex-1 min-w-[4rem] bg-transparent text-sm outline-none placeholder:text-support-500"
          placeholder={options.length === 0 ? "Type and press Enter" : "Add more..."}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
        />
      </div>
    </div>
  )
}

function FormLayoutPreview({ layout, fields }: { layout: FormLayout; fields: FormField[] }) {
  switch (layout) {
    case "inline":
      return (
        <div className="rounded-lg border border-border-main p-5 bg-hover-subtle/30">
          <div className="flex items-end gap-3 flex-wrap">
            {fields.map(field => (
              <div key={field.id} className="flex-1 min-w-[8rem]">
                <FormFieldPreview field={field} />
              </div>
            ))}
          </div>
        </div>
      )

    case "grid":
      return (
        <div className="rounded-lg border border-border-main p-5 bg-hover-subtle/30">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {fields.map(field => (
              <div key={field.id} style={{ gridColumn: `span ${field.colSpan}` }}>
                <FormFieldPreview field={field} />
              </div>
            ))}
          </div>
        </div>
      )

    case "block":
      return (
        <div className="flex flex-col gap-4">
          {fields.map(field => (
            <div key={field.id} className="rounded-lg border border-border-main p-4 bg-hover-subtle/30">
              <FormFieldPreview field={field} />
            </div>
          ))}
        </div>
      )

    case "horizontal":
      return (
        <div className="rounded-lg border border-border-main p-5 bg-hover-subtle/30">
          <div className="flex flex-col gap-4">
            {fields.map(field => (
              <div key={field.id} className="flex items-center gap-4">
                <label className="w-32 shrink-0 text-xs font-medium text-support-200 text-right">
                  {field.label || "Untitled"}
                  {field.required && <span className="text-danger-400 ml-0.5">*</span>}
                </label>
                <div className="flex-1">
                  <FormFieldPreview field={field} hideLabel />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "nolabel":
      return (
        <div className="rounded-lg border border-border-main p-5 bg-hover-subtle/30">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {fields.map(field => (
              <div key={field.id} style={{ gridColumn: `span ${field.colSpan}` }}>
                <FormFieldPreview field={field} hideLabel />
              </div>
            ))}
          </div>
        </div>
      )

    case "basic":
    default:
      return (
        <div className="rounded-lg border border-border-main p-5 bg-hover-subtle/30">
          <div className="flex flex-col gap-5">
            {fields.map(field => (
              <div key={field.id}>
                <FormFieldPreview field={field} />
              </div>
            ))}
          </div>
        </div>
      )
  }
}

function PreviewLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <label className="block text-xs font-medium text-support-200 mb-1.5">
      {label}
      {required && <span className="text-danger-400 ml-0.5">*</span>}
    </label>
  )
}

function PreviewCheckbox({ field }: { field: FormField }) {
  const [checked, setChecked] = useState(false)
  const label = field.label || "Untitled"

  return (
    <label className="flex items-center gap-2.5 text-sm text-support-200 cursor-pointer select-none h-10 px-1 rounded-md hover:bg-hover-subtle transition-colors">
      <span
        className={`flex items-center justify-center w-[18px] h-[18px] rounded border transition-colors ${
          checked
            ? "border-primary-600 bg-primary-600"
            : "border-border-strong bg-transparent"
        }`}
      >
        {checked && <IconCheck size={13} className="text-white" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      {label}
      {field.required && <span className="text-danger-400 text-xs">*</span>}
    </label>
  )
}

function FormFieldPreview({ field, hideLabel }: { field: FormField; hideLabel?: boolean }) {
  const label = field.label || "Untitled"
  const labelText = hideLabel ? undefined : `${label}${field.required ? " *" : ""}`
  const placeholderText = hideLabel ? (field.placeholder || label) : field.placeholder

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {!hideLabel && <PreviewLabel label={label} required={field.required} />}
          <textarea
            className="w-full h-20 px-3 py-2 text-sm bg-transparent border border-border-main rounded-lg outline-none resize-none focus:border-primary-600 transition-colors placeholder:text-support-500"
            placeholder={placeholderText}
          />
        </div>
      )
    case "checkbox":
      return <PreviewCheckbox field={field} />
    case "select":
      return (
        <NativeSelect
          size="sm"
          label={labelText}
          placeholder={placeholderText || "Select..."}
          options={field.options.map(opt => ({ label: opt, value: opt }))}
        />
      )
    case "number":
      return (
        <NumberInput
          size="sm"
          label={labelText}
          placeholder={placeholderText}
        />
      )
    case "date":
      return (
        <DatePicker
          size="sm"
          label={labelText}
          placeholder={placeholderText || "Select date"}
          clearable
        />
      )
    case "email":
    case "text":
      return (
        <Input
          size="sm"
          label={labelText}
          type={field.type === "email" ? "email" : "text"}
          placeholder={placeholderText}
        />
      )
  }
}

export default FormBuilder
