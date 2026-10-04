import { IconAvocado, IconDatabasePlus, IconEdit, IconForms, IconGrid3x3 } from "@tabler/icons-react"
import { useSelector, useDispatch } from "react-redux"
import { areas } from "../../../contexts/area"
import { update } from "../../../contexts/area/functions/update"
import { RootState, AppDispatch } from "../../../contexts/store"
import Header from "../../../components/header"
import HeaderAction from "./action"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
    const [sheets,setSheets] = useState<number[]>([])
    const [sheetsLinkingPopover,setLinkingPopover] =useState(false)
    useEffect(()=>{
      setSheets(area.structure.sheets) 
    },[])
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
                <HeaderAction
                    className="flex flex-col items-center"
                    description="Link a database"
                    onClick={() => {
                       setLinkingPopover( true);
                       
                    }}
                    aria-label="Link sheet"
                >
                    <IconDatabasePlus size={24} stroke={1.5} />
                    <span className="text-xs">sheets</span>
                    <SheetsLinkingPopover state={sheetsLinkingPopover} setState={setLinkingPopover}/>
                </HeaderAction>
            </div>
        </Header>
    )
} 
export default AreaHeader

let SheetsLinkingPopover = ({state,setState}:{state:boolean,setState:Dispatch<SetStateAction<boolean>>})=>{
  const [list,setList] = useState<Sheet[]>([])
  const active = useSelector((state:RootState)=>state.area.active.area)
  const dispatch = useDispatch()
  useAsync( async ()=>{
     let channel = new Channel<Sheet[]>((res)=>{
      setList(res)
    })
    await invoke("sheets_control",{ payload: { command:"list",}, channel});
  }, [])  
  return(<>
      {state
        &&
        <div className="absolute -bottom-19 w-[20rem] z-1000  right-0 bg border-border-main border p-2">
        <Select
          placeholder="select or search for a sheet"
          options={list.map(item=>({label:item.name,value:String(item.id)}))} 
          onChange={(val)=>{}} />
         {active.structure.sheets?.map((id)=>(<div>id</div>))}
         {!!active.structure.sheets || active.structure.sheets?.length == 0?<div>there is no linked sheets</div>:""}
        </div>
      }
  </>)
}


