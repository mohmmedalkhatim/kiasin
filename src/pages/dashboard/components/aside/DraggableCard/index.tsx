import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { IconGridDots, IconTrash } from "@tabler/icons-react";
import { Card } from "../../../../../contexts/dashboard";
import { CSSProperties } from "react";

function DraggableCard({ card, id, style: externalStyle, onDelete }: { card: Card, id: number, style?: CSSProperties, onDelete?: () => void }) {
    let {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const dndTransform = CSS.Transform.toString(transform);

    const mergedStyle: CSSProperties = isDragging
        ? { transform: dndTransform, transition, zIndex: 10, opacity: 0.5 }
        : {
            ...externalStyle,
            transform: [externalStyle?.transform, dndTransform].filter(Boolean).join(' '),
            transition: [externalStyle?.transition, transition].filter(Boolean).join(', '),
        };

    return (
        <div
            className="p-3 border rounded-md border-border-main flex gap-2 items-center text-sm transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-hover-subtle cursor-grab active:cursor-grabbing"
            ref={setNodeRef}
            style={mergedStyle}
            {...attributes}
            {...listeners}
        >
            <IconGridDots size="1rem" className="text-support-500 shrink-0" />
            <span className="truncate capitalize flex-1">{card.type.replaceAll('_', ' ')}</span>
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Delete card"
                    className="p-2 rounded-md text-support-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors duration-150 shrink-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                >
                    <IconTrash size={14} />
                </button>
            )}
        </div>
    )
}
export default DraggableCard
