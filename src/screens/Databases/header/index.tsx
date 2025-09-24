import { IconDatabasePlus, IconDatabaseSearch } from "@tabler/icons-react"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import { useDatabase } from "../../../context/para/database"

function Dbs_Header() {
    const create_db =  useDatabase(state=>state.create)
    return (
        <header>
            <Input placeholder="search databases" icon={<IconDatabaseSearch size={"1.1rem"} stroke={"2px"} />} />
            <Button size="sm" className="text-[13px] py-1" onClick={()=>create_db()}>create<IconDatabasePlus size={"1.1rem"} /></Button>
        </header>
    )
}
export default Dbs_Header