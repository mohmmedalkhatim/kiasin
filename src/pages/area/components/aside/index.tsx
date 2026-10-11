import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../contexts/store";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableCard from "./DraggableCard";
import { useEffect, useState } from "react";
import { areas, Card } from "../../../../contexts/area";
import { update } from "../../../../contexts/area/functions/update";
import Popover from "../Popover";
import { IconChevronUp } from "@tabler/icons-react";
import Button from "../../../../components/Button";

function Aside() {
  const dispatch = useDispatch<AppDispatch>();
  let structure = useSelector((state: RootState) => state.area.active.area.structure);
  let area = useSelector((state: RootState) => state.area.active.area);
  let [items, setItems] = useState<Card[]>(structure.cards);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setItems(structure.cards);
  }, [structure.cards.length]);
  useEffect(()=>{
    setItems(area.structure.cards)
  },[area])
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const reordered = structuredClone(arrayMove(items, Number(active.id), Number(over.id)));
      setItems(reordered);
      dispatch(areas.actions.update_card_order(reordered));
      dispatch(update({ ...area, structure: { ...structure, cards: reordered } }));
    }
  }
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="fixed p-3 gap-2 pb-5 bottom-0 flex flex-col justify-between w-[18rem] border right-24 mt-28 z-120 border-border-main bg">
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={structure.cards} strategy={verticalListSortingStrategy}>
                <div className="gap-2 flex flex-col overflow-x-auto gutter pb-2">
                  {items.map((item, i) => (
                    <DraggableCard
                      key={i}
                      card={item}
                      id={i}
                      style={{
                        transition: open
                          ? `opacity 200ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms, transform 200ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms`
                          : 'none',
                        opacity: open ? 1 : 0,
                        transform: open ? 'translateY(0)' : 'translateY(6px)',
                      }}
                    />
                  ))}
                </div>
                <DragOverlay />
              </SortableContext>
            </DndContext>
          </div>
        </div>
        <Button variant="outlined" onClick={() => setOpen(state => !state)}>
          <IconChevronUp
            className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </Button>
        <Popover />
      </aside>
    </>
  );
}
export default Aside;
