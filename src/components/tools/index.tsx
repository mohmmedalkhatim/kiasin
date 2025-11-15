import { Icon12Hours, IconUser, IconUsers } from "@tabler/icons-react"
import { useState } from "react"
import { Link } from "react-router-dom"

function Toolsbar() {
  let [opened, setOpend] = useState(true)

  return (
    <nav className="toolsbar">
      <div className="flex flex-col gap-8">
        <Link to={"/account"}><IconUser /></Link>
        <Link to={"/people"}><IconUsers /></Link>
      </div>
    </nav>
  )
}
export default Toolsbar