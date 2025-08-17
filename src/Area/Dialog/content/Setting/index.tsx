import { useState } from "react"
import SettingNav from "./Nav"
import Content from "./content/content"



function Setting() {
    const [section, Switch] = useState(1)
    return (
        <div className="relative overflow-hidden">
            <SettingNav Switch={Switch} />
            <div>
                <Content id={section} />
            </div>
        </div>
    )
}
export default Setting