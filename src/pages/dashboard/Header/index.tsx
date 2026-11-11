import { IconDatabasePlus, IconEdit, IconForms, IconGrid3x3, IconPlus, IconX, IconCheck, IconPencil } from "@tabler/icons-react"
import { useSelector, useDispatch } from "react-redux"
import { dashboards } from "../../../contexts/dashboard"
import { update } from "../../../contexts/dashboard/functions/update"
import { create_card } from "../../../contexts/dashboard/functions/card/create"
import { RootState, AppDispatch } from "../../../contexts/store"
import { list_forms } from "../../../contexts/forms/functions/list"
import type { FormDef } from "../../../contexts/forms"
import Header from "../../../components/header"
import HeaderAction from "./action"
import Input from "../../../components/input"
import Button from "../../../components/Button"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAsync } from "react-use";
import { Sheet } from "../../../contexts/sheets/objects";
import { Channel, invoke } from "@tauri-apps/api/core";
import { Select } from "../../../components/select";
import { useNavigate } from "react-router-dom";

interface headerProps {
    setDense: (nextValue?: any) => void
}

function DashboardHeader({ setDense }: headerProps) {
    let { dashboard } = useSelector((state: RootState) => state.dashboard.active)
    let editMode = useSelector((state: RootState) => state.dashboard.active.edit)
    let dispatch = useDispatch<AppDispatch>()
    let name = useSelector((state: RootState) => state.dashboard.active.dashboard.name)
    const [sheetsLinkingPopover, setLinkingPopover] = useState(false)
    const [formsPopover, setFormsPopover] = useState(false)
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(name)
    const popoverRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setDraft(name) }, [name])

    useEffect(() => {
        if (!editing) return
        const handler = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                commitName()
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [editing])

    const commitName = () => {
        setEditing(false)
        const trimmed = draft.trim()
        if (!trimmed || trimmed === name) { setDraft(name); return }
        const next = { ...dashboard, name: trimmed }
        dispatch(update(next))
        dispatch(dashboards.actions.update_active(next))
    }

    return (
        <Header className="bg z-120">
            <div className="flex items-center gap-2 min-w-0 relative">
                <button
                    className="flex items-center gap-2 group min-w-0 rounded px-1 -mx-1 hover:bg-hover-subtle transition-colors"
                    onClick={() => { setDraft(name); setEditing(true) }}
                >
                    <h1 className="text-lg font-semibold truncate">{name}</h1>
                    <IconPencil size={13} className="text-support-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
                {editing && (
                    <div
                        ref={popoverRef}
                        className="absolute left-0 top-full mt-2 z-[1000] w-72 rounded-lg bg-dark-900 border border-border-main shadow-xl shadow-black/40 animate-[selectEnter_120ms_ease-out]"
                    >
                        <div className="px-4 pt-3.5 pb-1.5">
                            <p className="text-[10px] font-semibold text-support-500 uppercase tracking-wider mb-2">Rename dashboard</p>
                            <Input
                                value={draft}
                                onChange={e => setDraft(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') commitName()
                                    if (e.key === 'Escape') { setDraft(name); setEditing(false) }
                                }}
                                autoFocus
                                placeholder="Dashboard name"
                            />
                        </div>
                        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border-main/50">
                            <Button size="sm" variant="tonal" onClick={() => { setDraft(name); setEditing(false) }}>Cancel</Button>
                            <Button size="sm" onClick={commitName} icon={<IconCheck size={14} />}>Save</Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <HeaderAction
                    description="Edit"
                    className={editMode ? 'bg-primary-600/12 text-primary-400 border-primary-500/30' : ''}
                    onClick={() => dispatch(dashboards.actions.toggle_editing())}
                >
                    <IconEdit size={18} stroke={1.5} />
                </HeaderAction>
                <HeaderAction
                    description="Dense"
                    className={dashboard.structure.dense ? 'bg-primary-600/12 text-primary-400 border-primary-500/30' : ''}
                    onClick={async () => {
                        setDense(!dashboard.structure.dense)
                        await dispatch(update({ ...dashboard, structure: { ...dashboard.structure, cards: dashboard.structure.cards, dense: !dashboard.structure.dense } }))
                        dispatch(dashboards.actions.update_active({ ...dashboard, structure: { ...dashboard.structure, cards: dashboard.structure.cards, dense: !dashboard.structure.dense } }))
                    }}
                >
                    <IconGrid3x3 size={18} stroke={1.5} />
                </HeaderAction>

                <div className="w-px h-5 bg-border-main mx-1" />

                <div className="relative">
                    <HeaderAction description="Forms" onClick={() => setFormsPopover(true)}>
                        <IconForms size={18} stroke={1.5} />
                    </HeaderAction>
                    <FormsPopover state={formsPopover} setState={setFormsPopover} />
                </div>
                <div className="relative">
                    <HeaderAction description="Sheets" onClick={() => setLinkingPopover(true)}>
                        <IconDatabasePlus size={18} stroke={1.5} />
                    </HeaderAction>
                    <SheetsLinkingPopover state={sheetsLinkingPopover} setState={setLinkingPopover} />
                </div>
            </div>
        </Header>
    )
}
export default DashboardHeader




let FormsPopover = ({ state, setState }: { state: boolean, setState: Dispatch<SetStateAction<boolean>> }) => {
  const formsList = useSelector((s: RootState) => s.forms.list)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state) dispatch(list_forms())
  }, [state])

  useEffect(() => {
    if (!state) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setState(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [state, setState])

  const addFormCard = (form: FormDef) => {
    let fieldCount = form.fields.length
    let fullWidth = form.fields.filter(f => f.colSpan === 2 || f.type === "textarea").length
    let halfWidth = fieldCount - fullWidth
    let fieldRows = fullWidth + Math.ceil(halfWidth / 2)
    let totalPx = fieldRows * 56 + 84
    let columns = fieldCount <= 2 ? 2 : 3
    let rows = Math.max(2, Math.min(4, Math.ceil(totalPx / 168)))
    dispatch(create_card({ type: "form", columns, rows, store: { list: undefined, formId: form.id } }))
    setState(false)
  }

  if (!state) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-72 z-[1000] origin-top-right rounded-lg bg border border-border-main shadow-xl shadow-dark-900/50 py-1 animate-[selectEnter_120ms_ease-out]"
    >
      <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-support-300 uppercase tracking-wider">Forms</span>
        <button
          className="p-1 rounded text-support-500 hover:text-support-200 hover:bg-hover-main transition-colors"
          onClick={() => { setState(false); navigate("/form_builder") }}
          aria-label="Go to form builder"
        >
          <IconPlus size={13} />
        </button>
      </div>

      {formsList.length > 0 ? (
        <div className="border-t border-border-main pt-1 max-h-56 overflow-y-auto">
          {formsList.map(form => (
            <button
              key={form.id}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-100 hover:bg-hover-main"
              onClick={() => addFormCard(form)}
            >
              <IconForms size={14} stroke={1.5} className="text-support-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] text-support-100 truncate block">{form.name}</span>
                <span className="text-[11px] text-support-600">
                  {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="border-t border-border-main px-3 py-5 text-center">
          <p className="text-xs text-support-500 mb-1.5">No forms yet</p>
          <button
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            onClick={() => { setState(false); navigate("/form_builder") }}
          >
            Open Form Builder
          </button>
        </div>
      )}
    </div>
  )
}

let SheetsLinkingPopover = ({state, setState}: {state: boolean, setState: Dispatch<SetStateAction<boolean>>}) => {
  const [list, setList] = useState<Sheet[]>([])
  const dashboard = useSelector((state: RootState) => state.dashboard.active.dashboard)
  const dispatch = useDispatch<AppDispatch>()
  const ref = useRef<HTMLDivElement>(null)

  useAsync(async () => {
    let channel = new Channel<Sheet[]>((res) => {
      setList(res)
    })
    await invoke("sheets_control", {payload: {command: "list"}, channel})
  }, [])

  useEffect(() => {
    if (!state) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setState(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [state, setState])

  const linkedSheets = dashboard.structure.sheets ?? []

  const linkSheet = async (val: string) => {
    const id = Number(val)
    if (linkedSheets.includes(id)) return
    const nextSheets = [...linkedSheets, id]
    const next = {...dashboard, structure: {...dashboard.structure, sheets: nextSheets}}
    await dispatch(update(next))
    dispatch(dashboards.actions.update_active(next))
  }

  const unlinkSheet = async (id: number) => {
    const nextSheets = linkedSheets.filter(s => s !== id)
    const next = {...dashboard, structure: {...dashboard.structure, sheets: nextSheets}}
    await dispatch(update(next))
    dispatch(dashboards.actions.update_active(next))
  }

  const unlinkedOptions = list
    .filter(s => s.id != null && !linkedSheets.includes(s.id))
    .map(s => ({label: s.name, value: String(s.id)}))

  if (!state) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-72 z-[1000] origin-top-right rounded-lg bg border border-border-main shadow-xl shadow-dark-900/50 py-1 animate-[selectEnter_120ms_ease-out]"
    >
      <div className="px-3 pt-1.5 pb-1.5">
        <Select
          placeholder="Search sheets…"
          options={unlinkedOptions}
          onChange={linkSheet}
        />
      </div>

      {linkedSheets.length > 0 ? (
        <div className="border-t border-border-main pt-1">
          <p className="px-3 pt-1.5 pb-1 text-[10px] text-support-600 font-semibold uppercase tracking-wider">Linked</p>
          {linkedSheets.map((id) => {
            const sheet = list.find(s => s.id === id)
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-2 px-3 py-1.5 transition-colors duration-100 hover:bg-hover-main group"
              >
                <span className="text-[13px] text-support-200 truncate">{sheet?.name ?? `Sheet #${id}`}</span>
                <button
                  className="shrink-0 p-1 rounded text-support-600 opacity-0 group-hover:opacity-100 transition-all duration-100 hover:text-danger-400 hover:bg-danger-500/8"
                  onClick={() => unlinkSheet(id)}
                  aria-label={`Unlink ${sheet?.name ?? `Sheet #${id}`}`}
                >
                  <IconX size={13} stroke={1.5} />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border-t border-border-main px-3 py-5 text-center">
          <p className="text-xs text-support-600">No linked sheets</p>
        </div>
      )}
    </div>
  )
}
