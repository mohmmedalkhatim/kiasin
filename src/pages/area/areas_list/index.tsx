import { Channel, invoke } from "@tauri-apps/api/core"
import { useState } from "react"
import { useAsync } from "react-use"
import { Area } from "../../../contexts/area"
import AreaLink from "./area_link"
import "./index.css"
import { AppDispatch } from "../../../contexts/store"
import { useDispatch } from "react-redux"
import { list as List } from "../../../contexts/area/functions/list"


function AreasList({ list,reload }: { list?: number[],reload:boolean  }) {
  const [areas, setAreas] = useState<Area[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const [refesh,setRefresh] =useState(false)
  useAsync(async () => {
    try {
      if (list) {
        let channel = new Channel<Area[]>((item) => {
          setAreas(item)
        })
        await invoke("areas_control", { payload: { command: "find_by_ids", ids: list }, channel })
      } else {
        dispatch(List(setAreas))

      }
    } catch (err) {
      console.error(err)
    }
  }, [reload,refesh])
  return (
    <>
      <div className="p-4 pt-22">
        <div className="area_list">
          {areas.map(area => <AreaLink Refresh={setRefresh} key={area.id} area={area} />)}
        </div>
      </div>
    </>
  )
}
export default AreasList
