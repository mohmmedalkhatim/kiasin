import { IconDots, IconPlus } from "@tabler/icons-react";
import { useTasks } from "../../../../context/para/tasks";


function Form({ column_id, title, card_id }: { column_id: number, card_id: number, title: string }) {
    const create_task = useTasks(state => state.create);
    return (
        <div className="flex items-center justify-between h-12 w-full px-4">
            <div className="text-xs rounded flex px-2 py-1 bg-[#e2e2e220] items-center gap-2">
                <div className="w-1 h-1 bg-[#e2e2e2] rounded"></div>
                <div>
                    {title}
                </div>
            </div>
            <div className="flex gap-3">
                <div className="p-1 hover:bg-[#e2e2e260] rounded-sm"><IconDots size={"0.8rem"} /></div>
                <div className="p-1 hover:bg-[#e2e2e260] rounded-sm" onClick={() => create_task("", card_id, column_id)}><IconPlus size={"0.8rem"} /></div>
            </div>
        </div>
    )
}
export default Form