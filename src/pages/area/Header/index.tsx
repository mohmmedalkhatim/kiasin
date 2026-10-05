import { IconDatabasePlus, IconEdit, IconForms, IconGrid3x3, IconX } from "@tabler/icons-react"
import { useSelector, useDispatch } from "react-redux"
import { areas } from "../../../contexts/area"
import { update } from "../../../contexts/area/functions/update"
import { RootState, AppDispatch } from "../../../contexts/store"
import Header from "../../../components/header"
import HeaderAction from "./action"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAsync } from "react-use";
import { Sheet } from "../../../contexts/sheets/objects";
import { Channel, invoke } from "@tauri-apps/api/core";
import { Select } from "../../../components/select";

interface headerProps {
    setDense: (nextValue?: any) => void
}

function AreaHeader({ setDense }: headerProps) {
    let { area } = useSelector((state: RootState) => state.area.active)
    let dispatch = useDispatch<AppDispatch>()
    let name = useSelector((state: RootState) => state.area.active.area.name)
    const [sheetsLinkingPopover,setLinkingPopover] = useState(false)
    return (
        <Header className="bg z-120">
            <h1 className="text-xl font-semibold">{name}</h1>
            <div className="flex items-center gap-2">
                <HeaderAction
                    className="flex flex-col items-center"
                    onClick={() => dispatch(areas.actions.toggle_editing())}
                    aria-label="Toggle edit mode"
                >
                    <IconEdit size={24} stroke={1.5} />
                    <span className="text-xs">Edit</span>
                </HeaderAction>
                <HeaderAction
                    className="flex flex-col items-center"
                    onClick={async () => {
                        setDense(!area.structure.dense)
                        await dispatch(update({ ...area, structure: { ...area.structure,cards: area.structure.cards, dense: !area.structure.dense, } }))
                        dispatch(areas.actions.update_active({ ...area, structure: { ...area.structure, cards: area.structure.cards, dense: !area.structure.dense } }))
                    }}
                    aria-label="Toggle dense layout"
                >
                    <IconGrid3x3 size={24} stroke={1.5} />
                    <span className="text-xs">Auto Fill</span>
                </HeaderAction>
                <HeaderAction
                    className="flex flex-col items-center"
                    description="Add a form"
                    onClick={() => {
                        // TODO: Implement form addition
                    }}
                    aria-label="Add form"
                >
                    <IconForms size={24} stroke={1.5} />
                    <span className="text-xs">Forms</span>
                </HeaderAction>
                <div className="relative">
                    <HeaderAction
                        className="flex flex-col items-center"
                        description="Link a database"
                        onClick={() => {
                           setLinkingPopover(true);
                        }}
                        aria-label="Link sheet"
                    >
                        <IconDatabasePlus size={24} stroke={1.5} />
                        <span className="text-xs">sheets</span>
                    </HeaderAction>
                    <SheetsLinkingPopover state={sheetsLinkingPopover} setState={setLinkingPopover}/>
                </div>
            </div>
        </Header>
    )
} 
export default AreaHeader

let SheetsLinkingPopover = ({state, setState}: {state: boolean, setState: Dispatch<SetStateAction<boolean>>}) => {
  const [list, setList] = useState<Sheet[]>([])
  const area = useSelector((state: RootState) => state.area.active.area)
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

  const linkedSheets = area.structure.sheets ?? []

  const linkSheet = async (val: string) => {
    const id = Number(val)
    if (linkedSheets.includes(id)) return
    const nextSheets = [...linkedSheets, id]
    const nextArea = {...area, structure: {...area.structure, sheets: nextSheets}}
    await dispatch(update(nextArea))
    dispatch(areas.actions.update_active(nextArea))
  }

  const unlinkSheet = async (id: number) => {
    const nextSheets = linkedSheets.filter(s => s !== id)
    const nextArea = {...area, structure: {...area.structure, sheets: nextSheets}}
    await dispatch(update(nextArea))
    dispatch(areas.actions.update_active(nextArea))
  }

  const unlinkedOptions = list
    .filter(s => s.id != null && !linkedSheets.includes(s.id))
    .map(s => ({label: s.name, value: String(s.id)}))

  if (!state) return null

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-[20rem] z-[1000] origin-top-right animate-menu-enter rounded-lg bg-[#232323] shadow-[0_2px_6px_0_rgba(0,0,0,0.15),0_8px_24px_0_rgba(0,0,0,0.3)] py-2"
    >
      <div className="px-3 pb-2">
        <Select
          placeholder="Search sheets…"
          options={unlinkedOptions}
          onChange={linkSheet}
        />
      </div>

      {linkedSheets.length > 0 ? (
        <div className="border-t border-[#e2e2e215] pt-1">
          <p className="px-4 pt-2 pb-1 text-xs text-support-500 font-medium tracking-wide">Linked</p>
          {linkedSheets.map((id) => {
            const sheet = list.find(s => s.id === id)
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-3 px-4 py-2 mx-1 rounded-md transition-colors duration-150 hover:bg-[#e2e2e210] cursor-default"
              >
                <span className="text-sm text-support-100 truncate">{sheet?.name ?? `Sheet #${id}`}</span>
                <button
                  className="shrink-0 p-1.5 -mr-1 rounded-full text-support-500 transition-colors duration-150 hover:text-danger-400 hover:bg-danger-500/10 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-1"
                  onClick={() => unlinkSheet(id)}
                  aria-label={`Unlink ${sheet?.name ?? `Sheet #${id}`}`}
                >
                  <IconX size={16} stroke={1.5} />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border-t border-[#e2e2e215] px-4 py-6 text-center">
          <p className="text-sm text-support-500">No linked sheets</p>
        </div>
      )}
    </div>
  )
}


