import { rectSwappingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable"
import { IconGridDots, IconLink, IconPlus } from "@tabler/icons-react"
import Task from "../Task"
import Form from "../form"
import { CSS } from "@dnd-kit/utilities"
import { useTasks } from "../../../../context/tasks"

function Column({ list, id, activeId, card_id }: { list: number[], id: number, activeId: String | null, classname?: string, card_id: number }) {
    const create_task = useTasks(state => state.create)

    return (
        <SortableContext items={list} strategy={rectSwappingStrategy} key={id}>
            <div className='task_list overflow-hidden'>
                {list?.map(item =>
                    item !== null ? (
                        <Task
                            id={item}
                            key={item}
                            classname={activeId === String(item) ? 'dragging' : ''}
                        />
                    ) : (
                        ''
                    )
                )}
                <div className='flex items-center gap-2 px-4 py-2' onClick={() => create_task("", card_id, id)}>
                    <div className='text-[#e2e2e230]'><IconPlus size={"0.9rem"} /></div>
                    <div className='text-[#e2e2e230] text-xs'>New</div>
                </div>
            </div>
        </SortableContext >


    )
}
export default Column