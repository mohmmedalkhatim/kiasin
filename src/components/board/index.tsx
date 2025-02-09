import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import Grid from './main/Grid';
import Card from './main/Card'

const Board: React.FC = () => {
  
  const [items, setItems] = useState(['1', '2', '3', '4']);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor), 
    useSensor(KeyboardSensor) 
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={8}>
          {items.map((id) => (
            <Card key={id} id={id} />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay>
        {activeId ? <Card id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;