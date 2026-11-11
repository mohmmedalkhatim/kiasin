import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../../../contexts/store"
import { update_card } from "../../../../contexts/dashboard/functions/card/update"
import { update_sheet } from "../../../../contexts/sheets/functions/update"
import { bumpRevision } from "../../../../contexts/sheets"
import type { FormDef, FormField, FormLayout } from "../../../../contexts/forms"
import type { Sheet, SheetDTO } from "../../../../contexts/sheets/objects"
import { list_forms } from "../../../../contexts/forms/functions/list"
import { useSheetNames } from "../useSheetNames"
import { useEffect, useState, useCallback } from "react"
import { Channel, invoke } from "@tauri-apps/api/core"
import { IconForms, IconSettings, IconCheck, IconSend, IconLoader2, IconTable, IconLink, IconAlertCircle } from "@tabler/icons-react"
import { Dialog } from "../../../../components/Dialog"
import { Select } from "../../../../components/select"
import Input from "../../../../components/input"
import NativeSelect from "../../../../components/native-select"
import NumberInput from "../../../../components/number-input"
import DatePicker from "../../../../components/datepicker"
import * as exceljs from "exceljs"
import { Buffer } from "buffer"

function colLetterToIndex(letters: string): number {
  let n = 0
  for (const ch of letters.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n
}

async function loadTableFromFile(file: any, name: string): Promise<exceljs.Table | null> {
  if (!file || !name) return null
  try {
    const workbook = new exceljs.Workbook()
    // @ts-ignore
    const ws = (await workbook.xlsx.load(file)).worksheets[0]
    const object = ws.getTable(name)
    // @ts-ignore
    const tableDef = object.table as exceljs.Table
    const numCols = tableDef.columns.length
    const refMatch = (tableDef.ref ?? "A1").match(/([A-Z]+)(\d+)/i)
    const startCol = refMatch ? colLetterToIndex(refMatch[1]) : 1
    const headerRow = refMatch ? parseInt(refMatch[2]) : 1
    const dataStartRow = headerRow + 1
    const rows: any[][] = []
    ws.eachRow((row, rowNumber) => {
      if (rowNumber < dataStartRow) return
      const cells: any[] = []
      for (let i = 0; i < numCols; i++) cells.push(row.getCell(startCol + i).value)
      if (cells.some(c => c !== null && c !== undefined)) rows.push(cells)
    })
    return {
      name: tableDef.name,
      ref: tableDef.ref ?? "A1",
      columns: tableDef.columns.map(c => ({ name: c.name, filterButton: c.filterButton })),
      rows,
    } as exceljs.Table
  } catch (error) {
    console.error(error)
    return null
  }
}

async function persistTable(
  sheetData: { id?: number; name: string; description: string; rows_info?: any[] },
  table: exceljs.Table,
  dispatch: AppDispatch,
) {
  const freshWorkbook = new exceljs.Workbook()
  const freshSheet = freshWorkbook.addWorksheet()
  freshSheet.addTable({
    name: table.name,
    ref: table.ref ?? "A1",
    columns: table.columns.map(c => ({ name: c.name, filterButton: c.filterButton })),
    rows: (table.rows ?? []).map(r => [...r]),
  })
  const buffer = await freshWorkbook.xlsx.writeBuffer()
  const dto: SheetDTO = { ...sheetData, file: Buffer.from(buffer).toString("base64") }
  await dispatch(update_sheet(dto))
}

function computeCardSize(form: FormDef): { columns: number; rows: number } {
  let fieldCount = form.fields.length
  let layout = form.layout ?? "basic"
  let fullWidthCount = form.fields.filter(f => f.colSpan === 2 || f.type === "textarea").length
  let halfWidthCount = fieldCount - fullWidthCount
  let chrome = 84

  switch (layout) {
    case "inline":
      return { columns: Math.min(4, fieldCount + 1), rows: fieldCount > 4 ? 3 : 2 }

    case "grid":
    case "nolabel": {
      let fieldRows = fullWidthCount + Math.ceil(halfWidthCount / 2)
      let rows = Math.max(2, Math.min(6, Math.ceil((fieldRows * 56 + chrome) / 168)))
      return { columns: 3, rows }
    }

    case "block": {
      let rows = Math.max(2, Math.min(6, Math.ceil((fieldCount * 68 + chrome) / 168)))
      return { columns: 2, rows }
    }

    case "horizontal": {
      let rows = Math.max(2, Math.min(6, Math.ceil((fieldCount * 48 + chrome) / 168)))
      return { columns: 3, rows }
    }

    case "basic":
    default: {
      let rows = Math.max(2, Math.min(6, Math.ceil((fieldCount * 56 + chrome) / 168)))
      return { columns: 2, rows }
    }
  }
}

export default function FormCard({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const card = useSelector((s: RootState) => s.dashboard.active.dashboard.structure.cards)[id]
  const dashboard = useSelector((s: RootState) => s.dashboard.active.dashboard)
  const formsList = useSelector((s: RootState) => s.forms.list)
  const linkedSheets = dashboard.structure.sheets ?? []

  const formId = card?.store?.formId
  const sheetId = card?.store?.sheetId
  const form = formsList.find(f => f.id === formId) ?? null
  const sheetNames = useSheetNames(linkedSheets)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (formsList.length === 0) dispatch(list_forms())
  }, [])

  const updateStore = (patch: Record<string, any>) => {
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, ...patch } },
    }))
  }

  const selectForm = (f: FormDef) => {
    let { columns, rows } = computeCardSize(f)
    dispatch(update_card({
      index: id,
      card: { ...card, store: { ...card.store, formId: f.id }, size: { columns, rows } },
    }))
    setSettingsOpen(false)
    setFormValues({})
    setErrors({})
    setSubmitted(false)
  }

  const setFieldValue = useCallback((fieldId: string, value: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }))
    setErrors(prev => {
      if (!prev[fieldId]) return prev
      let next = { ...prev }
      delete next[fieldId]
      return next
    })
    setSubmitted(false)
  }, [])

  const validate = useCallback((): boolean => {
    if (!form) return false
    let newErrors: Record<string, string> = {}
    for (let field of form.fields) {
      if (field.required && !formValues[field.id]?.trim()) {
        newErrors[field.id] = `${field.label || "This field"} is required`
      }
      if (field.type === "email" && formValues[field.id]?.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues[field.id])) {
          newErrors[field.id] = "Enter a valid email"
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form, formValues])

  const handleSubmit = useCallback(async () => {
    if (!form || !sheetId) return
    if (!validate()) return

    setSubmitting(true)
    try {
      let sheet = await new Promise<Sheet | null>((resolve) => {
        let channel = new Channel<Sheet[]>((res) => resolve(res[0] ?? null))
        invoke("sheets_control", { payload: { command: "retrieve", id: sheetId }, channel })
          .catch(() => resolve(null))
      })

      if (!sheet?.file || !sheet?.name) { setSubmitting(false); return }

      let table = await loadTableFromFile(sheet.file, sheet.name)
      if (!table) { setSubmitting(false); return }

      let columns = table.columns.map(c => c.name)
      let newRow: string[] = columns.map(colName => {
        let field = form.fields.find(f => f.label.toLowerCase() === colName.toLowerCase())
        if (!field) return ""
        return formValues[field.id] ?? ""
      })

      let updatedTable: exceljs.Table = {
        ...table,
        rows: [...(table.rows ?? []).map(r => [...r]), newRow],
      }

      await persistTable(sheet, updatedTable, dispatch)
      dispatch(bumpRevision())

      setSubmitted(true)
      setFormValues({})
      setErrors({})
      setTimeout(() => setSubmitted(false), 1500)
    } catch (err) {
      console.error("Form submit error:", err)
    } finally {
      setSubmitting(false)
    }
  }, [form, sheetId, formValues, dispatch, validate])

  if (!form) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-3 h-full">
        <FormPickerDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          forms={formsList}
          onSelect={selectForm}
        />
        <IconForms size={24} className="text-support-600" />
        <p className="text-xs text-support-500">No form selected</p>
        <button
          className="text-xs text-primary-400 hover:text-primary-300 rounded cursor-pointer"
          onClick={() => setSettingsOpen(true)}
        >
          Select form
        </button>
      </div>
    )
  }

  let linkedSheetOptions = linkedSheets.map(sid => ({
    label: sheetNames.get(sid) ?? `Sheet #${sid}`,
    value: String(sid),
  }))

  let errorCount = Object.keys(errors).length

  return (
    <div className="flex flex-col h-full group/card">
      <FormSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        forms={formsList}
        sheetOptions={linkedSheetOptions}
        currentFormId={formId}
        currentSheetId={sheetId}
        onSelectForm={selectForm}
        onLinkSheet={(sid) => updateStore({ sheetId: Number(sid) })}
      />

      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-support-500 uppercase tracking-wide truncate">
            {form.name}
          </span>
          {sheetId && (
            <span className="flex items-center gap-1 text-[10px] text-support-600">
              <IconLink size={10} />
              {sheetNames.get(sheetId) ?? "Sheet"}
            </span>
          )}
        </div>
        <button
          className="p-1.5 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-strong cursor-pointer"
          onClick={() => setSettingsOpen(true)}
          aria-label="Form settings"
        >
          <IconSettings size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-0">
        <FormFieldsLayout
          layout={form.layout ?? "basic"}
          fields={form.fields}
          formValues={formValues}
          errors={errors}
          setFieldValue={setFieldValue}
        />
      </div>

      <div className="shrink-0 px-4 pb-3 pt-2 border-t border-border-subtle">
        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2 text-[11px] text-danger-400" role="alert">
            <IconAlertCircle size={12} />
            {errorCount} required field{errorCount !== 1 ? "s" : ""} missing
          </div>
        )}
        {!sheetId ? (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border-main text-support-500 text-xs transition-colors cursor-pointer hover:border-primary-500/40 hover:text-primary-400"
            onClick={() => setSettingsOpen(true)}
          >
            <IconTable size={14} />
            Link a sheet to submit
          </button>
        ) : (
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              submitted
                ? "bg-success-700 text-white"
                : "bg-primary-800 hover:bg-primary-900 text-white"
            }`}
            onClick={handleSubmit}
            disabled={submitting || submitted}
          >
            {submitting ? (
              <><IconLoader2 size={14} className="animate-spin" /> Submitting...</>
            ) : submitted ? (
              <><IconCheck size={14} /> Submitted</>
            ) : (
              <><IconSend size={14} /> Submit</>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function FormSettingsDialog({
  open,
  onClose,
  forms,
  sheetOptions,
  currentFormId,
  currentSheetId,
  onSelectForm,
  onLinkSheet,
}: {
  open: boolean
  onClose: () => void
  forms: FormDef[]
  sheetOptions: { label: string; value: string }[]
  currentFormId?: string
  currentSheetId?: number
  onSelectForm: (form: FormDef) => void
  onLinkSheet: (sheetId: string) => void
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Form Settings" widthClass="w-96">
      <div className="px-6 flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold text-support-500 uppercase tracking-wider mb-2">Form</p>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {forms.length === 0 ? (
              <p className="text-xs text-support-500 py-2">No forms available</p>
            ) : forms.map(form => (
              <button
                key={form.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 cursor-pointer ${
                  form.id === currentFormId
                    ? "bg-primary-600/10 border border-primary-600/30"
                    : "hover:bg-hover-subtle border border-transparent"
                }`}
                onClick={() => onSelectForm(form)}
              >
                <IconForms size={14} className="text-support-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block">{form.name}</span>
                  <span className="text-[10px] text-support-600">
                    {form.fields.length} fields · {form.layout ?? "basic"}
                  </span>
                </div>
                {form.id === currentFormId && <IconCheck size={14} className="text-primary-400 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-support-500 uppercase tracking-wider mb-2">
            Linked sheet
          </p>
          <p className="text-[11px] text-support-600 mb-2">
            Submissions append rows to this sheet. Column names must match field labels.
          </p>
          {sheetOptions.length === 0 ? (
            <p className="text-xs text-support-500 py-2">Link sheets to this area first</p>
          ) : (
            <Select
              placeholder="Select sheet..."
              value={currentSheetId ? String(currentSheetId) : undefined}
              options={sheetOptions}
              onChange={onLinkSheet}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

function FormFieldsLayout({
  layout,
  fields,
  formValues,
  errors,
  setFieldValue,
}: {
  layout: FormLayout
  fields: FormField[]
  formValues: Record<string, string>
  errors: Record<string, string>
  setFieldValue: (id: string, val: string) => void
}) {
  let renderField = (field: FormField, hideLabel?: boolean) => (
    <FieldRenderer
      key={field.id}
      field={field}
      value={formValues[field.id] ?? ""}
      error={errors[field.id]}
      onChange={(val) => setFieldValue(field.id, val)}
      hideLabel={hideLabel}
    />
  )

  switch (layout) {
    case "inline":
      return (
        <div className="flex items-end gap-3 flex-wrap pt-2">
          {fields.map(f => <div key={f.id} className="flex-1 min-w-[6rem]">{renderField(f)}</div>)}
        </div>
      )
    case "grid":
      return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 pt-2">
          {fields.map(f => <div key={f.id} style={{ gridColumn: `span ${f.colSpan}` }}>{renderField(f)}</div>)}
        </div>
      )
    case "block":
      return (
        <div className="flex flex-col gap-3 pt-2">
          {fields.map(f => (
            <div key={f.id} className={`rounded-lg border p-3 transition-colors ${errors[f.id] ? "border-danger-500/40 bg-danger-500/5" : "border-border-main/50"}`}>
              {renderField(f)}
            </div>
          ))}
        </div>
      )
    case "horizontal":
      return (
        <div className="flex flex-col gap-4 pt-2">
          {fields.map(f => (
            <div key={f.id} className="flex items-start gap-3">
              <label className="w-24 shrink-0 text-[11px] font-medium text-support-400 text-right truncate pt-2.5">
                {f.label || "Untitled"}
                {f.required && <span className="text-danger-400 ml-0.5">*</span>}
              </label>
              <div className="flex-1">{renderField(f, true)}</div>
            </div>
          ))}
        </div>
      )
    case "nolabel":
      return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-2">
          {fields.map(f => <div key={f.id} style={{ gridColumn: `span ${f.colSpan}` }}>{renderField(f, true)}</div>)}
        </div>
      )
    case "basic":
    default:
      return (
        <div className="flex flex-col gap-5 pt-2">
          {fields.map(f => <div key={f.id}>{renderField(f)}</div>)}
        </div>
      )
  }
}

function FormPickerDialog({
  open,
  onClose,
  forms,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  forms: FormDef[]
  onSelect: (form: FormDef) => void
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Select Form" widthClass="w-80">
      <div className="px-4 pb-2">
        {forms.length === 0 ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <IconForms size={24} className="text-support-600" />
            <p className="text-sm text-support-500">No forms available</p>
            <p className="text-xs text-support-600">Create one in Form Builder</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {forms.map(form => (
              <button
                key={form.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-hover-subtle transition-colors cursor-pointer"
                onClick={() => onSelect(form)}
              >
                <IconForms size={16} className="text-support-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{form.name}</span>
                  <span className="text-[11px] text-support-500">
                    {form.fields.length} field{form.fields.length !== 1 ? "s" : ""} · {form.layout ?? "basic"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  )
}

function FieldRenderer({
  field,
  value,
  error,
  onChange,
  hideLabel,
}: {
  field: FormField
  value: string
  error?: string
  onChange: (val: string) => void
  hideLabel?: boolean
}) {
  const label = field.label || "Untitled"
  const req = field.required ? " *" : ""
  const labelText = hideLabel ? undefined : `${label}${req}`
  const placeholderText = hideLabel ? (field.placeholder || label) : field.placeholder

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {!hideLabel && (
            <label className="block text-[11px] font-medium text-support-400 mb-1">
              {label}{req}
            </label>
          )}
          <textarea
            className={`w-full h-16 px-2.5 py-1.5 text-xs bg-transparent border rounded-lg outline-none resize-none transition-colors placeholder:text-support-500 ${
              error ? "border-danger-500 focus:border-danger-400" : "border-border-main focus:border-primary-600"
            }`}
            placeholder={placeholderText}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <p className="text-[10px] text-danger-400 mt-1">{error}</p>}
        </div>
      )
    case "checkbox":
      return <CheckboxField field={field} value={value} error={error} onChange={onChange} />
    case "select":
      return (
        <NativeSelect
          size="sm"
          label={labelText}
          placeholder={placeholderText || "Select..."}
          options={field.options.map(opt => ({ label: opt, value: opt }))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      )
    case "number":
      return (
        <NumberInput
          size="sm"
          label={labelText}
          placeholder={placeholderText}
          value={value === "" ? "" : Number(value)}
          onChange={(val) => onChange(val === "" ? "" : String(val))}
          error={error}
        />
      )
    case "date":
      return (
        <DatePicker
          size="sm"
          label={labelText}
          placeholder={placeholderText || "Select date"}
          value={value}
          onChange={(val) => onChange(val)}
          error={error}
          clearable
        />
      )
    case "email":
    case "text":
    default:
      return (
        <Input
          size="sm"
          label={labelText}
          type={field.type === "email" ? "email" : "text"}
          placeholder={placeholderText}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      )
  }
}

function CheckboxField({
  field,
  value,
  error,
  onChange,
}: {
  field: FormField
  value: string
  error?: string
  onChange: (val: string) => void
}) {
  const checked = value === "true"
  const label = field.label || "Untitled"

  return (
    <div>
      <label className={`flex items-center gap-2 text-xs text-support-200 cursor-pointer select-none h-8 px-1 rounded-md hover:bg-hover-subtle transition-colors ${error ? "ring-1 ring-danger-500/30" : ""}`}>
        <span
          className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
            checked ? "border-primary-600 bg-primary-600" : error ? "border-danger-500" : "border-border-strong bg-transparent"
          }`}
        >
          {checked && <IconCheck size={11} className="text-white" />}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
        />
        {label}
        {field.required && <span className="text-danger-400 ml-0.5">*</span>}
      </label>
      {error && <p className="text-[10px] text-danger-400 mt-0.5 pl-1">{error}</p>}
    </div>
  )
}
