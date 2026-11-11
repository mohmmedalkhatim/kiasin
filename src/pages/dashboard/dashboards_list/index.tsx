import { Channel, invoke } from "@tauri-apps/api/core"
import { useState } from "react"
import { useAsync } from "react-use"
import { Dashboard } from "../../../contexts/dashboard"
import DashboardLink from "./dashboard_link"
import "./index.css"
import { AppDispatch } from "../../../contexts/store"
import { useDispatch } from "react-redux"
import { list as List } from "../../../contexts/dashboard/functions/list"


function DashboardsList({ list, reload }: { list?: number[], reload: boolean }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const [refresh, setRefresh] = useState(false)
  useAsync(async () => {
    try {
      if (list) {
        let channel = new Channel<Dashboard[]>((item) => {
          setDashboards(item)
        })
        await invoke("areas_control", { payload: { command: "find_by_ids", ids: list }, channel })
      } else {
        dispatch(List(setDashboards))
      }
    } catch (err) {
      console.error(err)
    }
  }, [reload, refresh])
  return (
    <>
      <div className="p-4 pt-22">
        <div className="dashboard_list">
          {dashboards.map(d => <DashboardLink Refresh={setRefresh} key={d.id} dashboard={d} />)}
        </div>
      </div>
    </>
  )
}
export default DashboardsList
