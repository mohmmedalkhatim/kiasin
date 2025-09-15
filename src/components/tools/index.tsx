import { Icon12Hours } from "@tabler/icons-react"
import { useState } from "react"

function Toolsbar() {
  let [opened, setOpend] = useState(true)

  return (
    <nav className="toolsbar">
      <Icon12Hours/>
    </nav>
  )
}
export default Toolsbar