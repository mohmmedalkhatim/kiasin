import { Dayjs } from "dayjs"
import Calendar from "../../../components/Calenders/Calender"
import { Dispatch } from "react"

function EventPageNavbar({ setActive }: { setActive: Dispatch<Dayjs> }) {
  return (
    <div className="h-[87vh] border min-w-[18rem] fixed top-[5.5rem] left-[69.5rem] border-[#e2e2e220]">
      <Calendar />
    </div>
  )
}
export default EventPageNavbar