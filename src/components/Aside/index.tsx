import Cards_List from "./cards_list"
import Templates_List from "./templates"
import "./index.css"
import { useAside } from "../../context/aside";
import { IconChevronsRight } from "@tabler/icons-react";
import Button from "../Button";



function Aside({ active, T }: { active: boolean, T: string }) {
    let content = T == "area" ? <Templates_List /> : <Cards_List />;
    let toggle = useAside(state => state.toggle);
    return (
        <aside className={`${active && "hide"} Aside`}>
            <div className="aside_header">
                <Button children={<IconChevronsRight/>} onClick={toggle}/>
                <h2>{T == "area" ? "Templates" : "Cards"}</h2>
            </div>
            <div className="content_container">
                {content}
            </div>
        </aside>
    )
}
export default Aside