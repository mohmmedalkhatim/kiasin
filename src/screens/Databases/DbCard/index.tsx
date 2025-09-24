import { IconDatabase } from "@tabler/icons-react"
import { useAside } from "../../../context/aside"

function DbCard({ id, name }: { id: number, name: String }) {
    let toggle = useAside(state => state.toggle)
    let Db_id = useAside(state => state.setDatabse_id)
    return (
        <div onClick={() => {
            Db_id(id)
            toggle("DBConfig")
        }} className="border-1 gap-3 rounded-sm border-[#e3e3e320] flex items-center flex-col justify-center padding-2">
            <IconDatabase size={"3rem"} />
            <div>{name}</div>
        </div>
    )
}
export default DbCard