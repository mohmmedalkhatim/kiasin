import { useState } from "react"
import Input from "../Input"

function Header() {
  let [search, setSearch] = useState()
  return (
    <header className="app_header">
      <div></div>
      <Input type={"text"} props={search} action={(e) => { setSearch(e.target.value) }} />
      <div></div>
      <div></div>
      <div></div>
    </header>
  )
}
export default Header