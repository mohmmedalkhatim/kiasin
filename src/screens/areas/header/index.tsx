import { IconLayout,  IconMapSearch } from "@tabler/icons-react"
import { useAreas } from "../../../context/para/areas"
import Button from "../../../components/Button"
import Input from "../../../components/Input"

function Areas_header() {
    let create = useAreas(state => state.create)
    return (
        <header>
            <Input placeholder="search areas" icon={<IconMapSearch size={"1.1rem"} stroke={"2px"} />} />
            <Button size="sm" className="text-[13px] text-xs" onClick={()=>create(1)}>create <IconLayout size={"1rem"}  /></Button>
        </header>
    )
}
export default Areas_header