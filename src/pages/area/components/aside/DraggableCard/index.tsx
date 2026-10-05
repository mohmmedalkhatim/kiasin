import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { IconGridDots } from "@tabler/icons-react";
import { Card } from "../../../../../contexts/area";
import { CSSProperties } from "react";

function DraggableCard({ card, id, style: externalStyle }: { card: Card, id: number, style?: CSSProperties }) {
    let {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const dndStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const mergedStyle: CSSProperties = isDragging
        ? { ...dndStyle, zIndex: 10, opacity: 0.9 }
        : { ...externalStyle, ...dndStyle };

    return (
        <div
            className="p-3 border rounded-md border-border-main flex gap-2 items-center text-sm transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#e2e2e208] cursor-grab active:cursor-grabbing"
            ref={setNodeRef}
            style={mergedStyle}
            {...attributes}
            {...listeners}
        >
            <IconGridDots size="1rem" className="text-support-500 shrink-0" />
            {card.type} {id}
        </div>
    )
}
export default DraggableCard
