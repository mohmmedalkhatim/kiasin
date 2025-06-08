import { IconBoxMultiple, IconCancel, IconX } from "@tabler/icons-react"
import { useLayoutDialog } from "../../../context/para/Dialog"

function DialogHeader() {
    let toggle = useLayoutDialog(state=>state.toggle)
  return (
    <div className="flex items-center justify-between border-[#e2e2e215] border-b pb-4 px-4">
        <div>header</div>
        <div onClick={toggle}><IconX/></div>
    </div>
  )
}
export default DialogHeader