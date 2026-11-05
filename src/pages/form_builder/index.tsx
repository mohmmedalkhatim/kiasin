import { useState, useCallback } from "react"
import { Channel, invoke } from "@tauri-apps/api/core"
import { useAsync } from "react-use"
import Header from "../../components/header"
import Button from "../../components/Button"
import Input from "../../components/input"
import { Dialog } from "../../components/Dialog"
import { Select } from "../../components/select"
import NativeSelect from "../../components/native-select"
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
} from "@tabler/icons-react"

type FieldType = "text" | "number" | "email" | "date" | "select" | "textarea" | "checkbox"

type ColSpan = 1 | 2

interface FormField {
  id: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
  options: string[]
  colSpan: ColSpan
}

interface FormDef {
  id: string
  name: string
  fields: FormField[]
  createdAt: string
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
]

function generateId() {
  return Math.random().toString(36).slice(2, 10)
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
  const [forms, setForms] = useState<FormDef[]>([])
  const [activeForm, setActiveForm] = useState<FormDef | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [formName, setFormName] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  useAsync(async () => {
    try {
      const channel = new Channel<FormDef[]>((items) => setForms(items))
      await invoke("forms_control", { payload: { command: "list" }, channel })
    } catch {
      // forms_control may not exist yet
    }
  }, [])

  const createForm = () => {
    if (!formName.trim()) return
    const form: FormDef = {
      id: generateId(),
      name: formName.trim(),
      fields: [newField()],
      createdAt: new Date().toISOString(),
    }
    setForms(prev => [...prev, form])
    setActiveForm(form)
    setFormName("")
    setCreateOpen(false)
  }

  const updateActiveForm = useCallback((updater: (f: FormDef) => FormDef) => {
    setActiveForm(prev => {
      if (!prev) return prev
      const next = updater(prev)
      setForms(fs => fs.map(f => f.id === next.id ? next : f))
      return next
    })
  }, [])

  const addField = () => {
    updateActiveForm(f => ({ ...f, fields: [...f.fields, newField()] }))
  }

  const removeField = (fieldId: string) => {
    updateActiveForm(f => ({ ...f, fields: f.fields.filter(fi => fi.id !== fieldId) }))
  }

  const updateField = (fieldId: string, patch: Partial<FormField>) => {
    updateActiveForm(f => ({
      ...f,
      fields: f.fields.map(fi => fi.id === fieldId ? { ...fi, ...patch } : fi),
    }))
  }

  const deleteForm = (formId: string) => {
    setForms(prev => prev.filter(f => f.id !== formId))
    if (activeForm?.id === formId) setActiveForm(null)
  }

  const duplicateForm = (form: FormDef) => {
    const copy: FormDef = {
      ...form,
      id: generateId(),
      name: form.name + " (copy)",
      fields: form.fields.map(f => ({ ...f, id: generateId() })),
      createdAt: new Date().toISOString(),
    }
    setForms(prev => [...prev, copy])
    setActiveForm(copy)
  }

  const moveField = (from: number, to: number) => {
    if (from === to) return
    updateActiveForm(f => {
      const fields = [...f.fields]
      const [moved] = fields.splice(from, 1)
      fields.splice(to, 0, moved)
      return { ...f, fields }
    })
  }

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragFrom(idx)
    e.dataTransfer.effectAllowed = "move"
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.4"
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDragFrom(null)
    setDragOver(null)
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = ""
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(idx)
  }

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
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
                onClick={() => setActiveForm(null)}
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

          <div className="pt-22 px-6 pb-6 max-w-4xl mx-auto">
            {activeForm.fields.length === 0 ? (
              <EmptyFields onAdd={addField} />
            ) : (
              <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-lg border border-border-main p-5 bg-hover-subtle/30">
                  {activeForm.fields.map(field => (
                    <div key={field.id} style={{ gridColumn: `span ${field.colSpan}` }}>
                      <FormFieldPreview field={field} />
                    </div>
                  ))}
                </div>
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
        <Button size="sm" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>
          New form
        </Button>
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

      <div className="p-6 pt-22">
        {forms.length === 0 ? (
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
            {forms.map(form => (
              <FormCard
                key={form.id}
                form={form}
                onSelect={() => setActiveForm(form)}
                onDuplicate={() => duplicateForm(form)}
                onDelete={() => deleteForm(form.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium truncate">{form.name}</span>
        <span className="text-[11px] text-support-500 tabular-nums">{form.fields.length} fields</span>
      </div>

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

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ gridColumn: `span ${field.colSpan}` }}
      className={`group border rounded-lg transition-colors duration-100 ${
        dragOver
          ? "border-primary-500 bg-primary-600/5"
          : "border-border-main hover:border-border-strong"
      }`}
    >
      {/* Header row — drag handle, label, actions */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-subtle">
        <span className="cursor-grab active:cursor-grabbing text-support-600 hover:text-support-400 transition-colors p-1">
          <IconGripVertical size={14} />
        </span>

        <input
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-support-500 focus-visible:underline focus-visible:underline-offset-4 focus-visible:decoration-primary-600/40"
          placeholder="Field label"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          aria-label="Field label"
        />

        <span className="text-[10px] text-support-600 tabular-nums select-none shrink-0">#{index + 1}</span>

        <div className="flex items-center">
          <button
            className="p-1.5 rounded-md text-support-500 hover:text-support-200 hover:bg-hover-strong disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={`Move ${fieldName} up`}
          >
            <IconChevronUp size={14} />
          </button>
          <button
            className="p-1.5 rounded-md text-support-500 hover:text-support-200 hover:bg-hover-strong disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label={`Move ${fieldName} down`}
          >
            <IconChevronDown size={14} />
          </button>
        </div>

        <button
          className={`p-1.5 rounded-md border shrink-0 transition-colors cursor-pointer ${
            field.colSpan === 2
              ? "border-primary-600 bg-primary-600/10 text-primary-400"
              : "border-border-main text-support-500 hover:border-border-strong hover:text-support-300"
          }`}
          onClick={() => onUpdate({ colSpan: field.colSpan === 1 ? 2 : 1 })}
          aria-label={field.colSpan === 1 ? "Expand to full width" : "Shrink to half width"}
          title={field.colSpan === 1 ? "Full width" : "Half width"}
        >
          {field.colSpan === 1 ? <IconColumns2 size={14} /> : <IconColumnInsertRight size={14} />}
        </button>

        <button
          className="p-1.5 rounded-md text-support-600 hover:text-danger-400 hover:bg-danger-900/20 transition-colors cursor-pointer shrink-0"
          onClick={onRemove}
          aria-label={`Delete ${fieldName}`}
        >
          <IconTrash size={14} />
        </button>
      </div>

      {/* Body — type, placeholder, options, required */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <NativeSelect
          size="sm"
          label="Type"
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
          options={FIELD_TYPES}
        />

        <input
          className="bg-transparent text-xs text-support-400 outline-none placeholder:text-support-600 border-b border-transparent focus-visible:border-primary-600/40 pb-1 transition-colors"
          placeholder="Placeholder text (optional)"
          value={field.placeholder}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          aria-label={`Placeholder for ${fieldName}`}
        />

        {field.type === "select" && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-support-500 uppercase tracking-wider font-medium">Options (comma separated)</span>
            <input
              className="bg-transparent text-xs outline-none border-b border-border-main pb-1.5 placeholder:text-support-600 focus-visible:border-primary-600 transition-colors"
              placeholder="Option 1, Option 2, Option 3"
              value={field.options.join(", ")}
              onChange={(e) => onUpdate({ options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              aria-label={`Options for ${fieldName}`}
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-support-400 cursor-pointer select-none w-fit">
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
      </div>
    </div>
  )
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
    <label
      className="flex items-center gap-2.5 text-sm text-support-200 cursor-pointer select-none h-10 px-1 rounded-md hover:bg-hover-subtle transition-colors"
    >
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

function FormFieldPreview({ field }: { field: FormField }) {
  const label = field.label || "Untitled"

  switch (field.type) {
    case "textarea":
      return (
        <div>
          <PreviewLabel label={label} required={field.required} />
          <textarea
            className="w-full h-20 px-3 py-2 text-sm bg-transparent border border-border-main rounded-md outline-none resize-none focus:border-primary-600 transition-colors placeholder:text-support-500/60"
            placeholder={field.placeholder}
          />
        </div>
      )
    case "checkbox":
      return <PreviewCheckbox field={field} />
    case "select":
      return (
        <Select
          label={`${label}${field.required ? " *" : ""}`}
          placeholder={field.placeholder || "Select..."}
          options={field.options.map(opt => ({ label: opt, value: opt }))}
        />
      )
    case "email":
    case "number":
    case "text":
    case "date":
      return (
        <Input
          size="sm"
          label={`${label}${field.required ? " *" : ""}`}
          type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
          placeholder={field.placeholder}
        />
      )
  }
}

export default FormBuilder
