import { useState } from "react"
import SettingNav from "./Nav"

function Setting() {
    const [index, setindex] = useState(1)
    return (
        <div className="relative overflow-hidden">
            <SettingNav />
        </div>
    )
}
export default Setting