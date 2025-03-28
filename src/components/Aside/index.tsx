import Cards_List from "./cards_list"
import Templates_List from "./templates"

function Aside({ active, T }: { active: boolean, T: string }) {
    let content = T == "area" ? <Templates_List /> : <Cards_List />;
    return (
        <aside className={`${active ? "show" : "hide"} Aside`}>
            {content}
        </aside>
    )
}
export default Aside