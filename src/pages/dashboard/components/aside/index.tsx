import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../contexts/store";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { useEffect, useMemo, useState } from "react";
import { dashboards, Card } from "../../../../contexts/dashboard";
import { update } from "../../../../contexts/dashboard/functions/update";
import CardPicker from "../Popover";
import { IconChevronUp, IconGridDots } from "@tabler/icons-react";
import { delete_card } from "../../../../contexts/dashboard/functions/card/delete";
import Button from "../../../../components/Button";

function CardPanel() {
  const dispatch = useDispatch<AppDispatch>();
  let structure = useSelector((state: RootState) => state.dashboard.active.dashboard.structure);
  let dashboard = useSelector((state: RootState) => state.dashboard.active.dashboard);
  let [items, setItems] = useState<Card[]>(structure.cards);
  let [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const itemIds = useMemo(() => items.map(c => c.id), [items]);

  useEffect(() => {
    setItems(structure.cards);
  }, [structure.cards.length]);
  useEffect(() => {
    setItems(dashboard.structure.cards);
  }, [dashboard]);
  function handleDragStart(event: DragStartEvent) {
    setActiveCard(items.find(c => c.id === event.active.id) ?? null);
  }
  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(c => c.id === active.id);
      const newIndex = items.findIndex(c => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = structuredClone(arrayMove(items, oldIndex, newIndex));
      setItems(reordered);
      dispatch(dashboards.actions.update_card_order(reordered));
      dispatch(update({ ...dashboard, structure: { ...structure, cards: reordered } }));
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
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div className="gap-2 flex flex-col overflow-x-auto gutter pb-2">
                  {items.map((item, i) => (
                    <DraggableCard
                      key={item.id}
                      card={item}
                      id={item.id}
                      onDelete={() => dispatch(delete_card({ id: i }))}
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
              </SortableContext>
              <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.16,1,0.3,1)' }}>
                {activeCard ? (
                  <div className="p-3 border rounded-md border-border-main flex gap-2 items-center text-sm bg shadow-lg">
                    <IconGridDots size="1rem" className="text-support-500 shrink-0" />
                    {activeCard.type} {activeCard.id}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
        <Button variant="outlined" onClick={() => setOpen(state => !state)}>
          <IconChevronUp
            className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
        </Button>
        <CardPicker />
      </aside>
    </>
  );
}
export default CardPanel;
