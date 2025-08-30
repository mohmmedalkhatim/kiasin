import { Dayjs } from "dayjs"
import { Dispatch, SetStateAction } from "react"

function Header({ setActive }: { setActive: Dispatch<SetStateAction<Dayjs>> }) {
  return (
    <header>Header</header>
  )
}
export default Header