import Navbar from "./components/Navbar"
import Header from "./components/Header"
import WeekEvents from "./components/WeekEvents"
import "./style.css"
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"

function EventsPage() {
  let [current] = useState<Dayjs>(dayjs());
  let [active, setActive] = useState<Dayjs>(dayjs());
  return (
    <>
      <Header setActive={setActive} />
      <main className="content flex gap-4 p-6">
        <WeekEvents current={current} active={active} setActive={setActive}/>
        <Navbar setActive={setActive} />
      </main>
    </>
  )
}
export default EventsPage;