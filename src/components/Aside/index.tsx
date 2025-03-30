import Cards_List from "./cards_list"
import Templates_List from "./templates"
import "./index.css"
import { useAside } from "../../context/aside";
import { IconChevronsRight } from "@tabler/icons-react";



function Aside({ active, T }: { active: boolean, T: string }) {
    let content = T == "area" ? <Templates_List /> : <Cards_List />;
    let toggle = useAside(state => state.toggle);
    return (
        <aside className={`${active && "hide"} Aside`}>
            <IconChevronsRight className="toggle" onClick={toggle}/>
                <div className="content_container">
                    {content}
                </div>
        </aside>
    )
}
export default Aside