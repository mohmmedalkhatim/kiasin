import { IconDatabasePlus } from "@tabler/icons-react"
import Button from "../../../components/Button"

function Header() {
    return (
        <header>
            <div>
                Header
            </div>
            <Button size="sm" className="text-[13px] py-1">create<IconDatabasePlus size={"1.1rem"} /></Button>
        </header>
    )
}
export default Header