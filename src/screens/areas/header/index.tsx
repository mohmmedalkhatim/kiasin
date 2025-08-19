import { IconLayout, IconLayout2, IconLayoutBoard } from "@tabler/icons-react"
import { useAreas } from "../../../context/para/areas"
import Button from "../../../components/Button"

function Areas_header() {
    let create = useAreas(state => state.create)
    return (
        <header>
            <div>Areas_header</div>
            <Button size="sm" className="text-[13px] text-xs" onClick={()=>create(1)}>create <IconLayout size={"1rem"}  /></Button>
        </header>
    )
}
export default Areas_header