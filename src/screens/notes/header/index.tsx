import { IconDashboard, IconPencilSearch } from "@tabler/icons-react"
import Button from "../../../components/Button"
import { useNotes } from "../../../context/para/notes"
import Input from "../../../components/Input"


function Notes_header() {
  let create = useNotes(state => state.create)
  return (
    <header>
      <Input placeholder="search areas" icon={<IconDashboard size={"1.1rem"} stroke={"2px"} />} />
      <Button size="sm" className="text-[13px] text-xs" onClick={() => create(1)}>create <IconPencilSearch size={"1rem"} /></Button>
    </header>
  )
}
export default Notes_header