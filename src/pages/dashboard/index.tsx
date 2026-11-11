import { retrieve } from "../../contexts/dashboard/functions/retrieve"
import { AppDispatch, RootState } from "../../contexts/store"
import CardContainer from "./containers/card_container"
import { useDispatch, useSelector } from "react-redux"
import CardContent from "./components/CardContent"
import MainGrid from "./containers/main_gird"
import { useParams } from "react-router-dom"
import Aside from "./components/aside"
import { useAsync } from "react-use"
import { useState } from "react"
import "./index.css"
import DashboardHeader from "./Header"
import { trackRecentDashboard } from "../../lib/storage"

function Dashboard() {
  let { id } = useParams()
  let dispatch = useDispatch<AppDispatch>()
  let { edit, dashboard } = useSelector((state: RootState) => state.dashboard.active)
  let [ denseState, setDense ] = useState(false)
  useAsync(async () => {
    if (dashboard.id !== Number(id)) {
      dispatch(retrieve(Number(id)))
    } else {
      setDense(dashboard.structure.dense)
    }
    trackRecentDashboard(Number(id))
  }, [dashboard.id, id])

  if (dashboard.id !== Number(id)) {
    return (
      <main className="dashboard_container relative flex items-center justify-center h-screen">
        <div className="animate-pulse text-sm text-support-500">Loading…</div>
      </main>
    )
  }

  return (
    <main className="dashboard_container relative">
      <DashboardHeader setDense={setDense} />
      <MainGrid dense={denseState}>
        {dashboard.structure.cards.map((item,index) => (
          <CardContainer
            key={item.id}
            columns={item.size.columns}
            rows={item.size.rows}
            id={item.id as never}
          >
            <CardContent type={item.type} id={index} />
          </CardContainer>
        ))}
      </MainGrid>
      {edit && <Aside />}
    </main>
  )
}
export default Dashboard
