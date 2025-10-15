import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { IconGridDots } from '@tabler/icons-react';
import { useAreas } from '../../../../../context/para/areas';
import Form from '../../form';
import Column from '..';


function ColContainer({id,cols,column,setSchema}:{id:number,cols:number,column:{name:string,id:number,list:number[]},setSchema:Dispatch<SetStateAction<{id:number,list:number[],name:string}[]>>}) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const card = useAreas(state => state.get_Card)(id);
    const updateCard = useAreas(state => state.update_card);
    const act = useAreas(state => state.active);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({id:column.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    useEffect(() => {
        if (cols && cols > card.props.columns.length) {
            card.props.columns.push({ id: card.props.columns.length, name: "untitled", list: [] })
            updateCard(id, card)
        }
        // Ensure all columns have an 'id' property
        setSchema(card.props.columns.map((col: any, idx: number) => ({
            id: col.id ?? idx,
            name: col.name,
            list: col.list
        })));
    }, [act, cols]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };




    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        setSchema((prev) => {
            const newSchema = prev.map(col => ({ ...col, list: [...col.list] }));

            const sourceCol = newSchema.find(col => col.list.includes(active.id));
            const targetCol = newSchema.find(col => col.list.includes(over.id));

            if (sourceCol && targetCol && sourceCol.id === targetCol.id) {
                const oldIndex = sourceCol.list.indexOf(active.id);
                const newIndex = targetCol.list.indexOf(over.id);

                sourceCol.list = arrayMove(sourceCol.list, oldIndex, newIndex);
                return newSchema;
            }

            if (sourceCol && targetCol && sourceCol.id !== targetCol.id) {
                sourceCol.list = sourceCol.list.filter(id => id !== active.id);

                const overIndex = targetCol.list.indexOf(over.id);
                targetCol.list.splice(overIndex + 1, 0, active.id);

                updateCard(id, { ...card, props: { ...card.props, columns: newSchema } });

                return newSchema;
            }

            if (sourceCol && !targetCol && over?.id) {
                const targetEmptyCol = newSchema.find(col => col.id === over.id);
                if (targetEmptyCol) {
                    sourceCol.list = sourceCol.list.filter(id => id !== active.id);
                    targetEmptyCol.list.push(active.id);
                }

                updateCard(id, { ...card, props: { ...card.props, columns: newSchema } });
                return newSchema;
            }

            return prev;
        });

        setActiveId(null);
    };
    return (
        <div
            className={`w-full flex relative h-full bg-[#181818]`}
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            <div className='w-full relative m_border'
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
                    modifiers={[]}
                >
                    <Form column_id={column.id} title={column.name} card_id={id} />
                    <Column list={column.list} id={column.id}  activeId={activeId} card_id={card.id} />
                </DndContext>
                <div className="absolute bottom-3 right-3">
                    <IconGridDots {...listeners} className='cursor-grab' size={'1.08rem'} />
                </div>
            </div>
        </div>
    )
}
export default ColContainer