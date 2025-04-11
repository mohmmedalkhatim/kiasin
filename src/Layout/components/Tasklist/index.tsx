import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import './index.css';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';
import Task from './Task';

function TaskList({ list }: { list: number[] }) {
  const [schema, setSchema] = useState(list);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    if (event.active.id !== event.over.id) {
      const oldIndex = schema?.indexOf(event.active.id);
      const newIndex = schema?.indexOf(event.over.id);
      setSchema(arrayMove(schema, oldIndex, newIndex));
    }
    setActiveId(null);
  };
  if (schema) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={schema}>
          <div className="list">
            {schema?.map((item) => (
              <Task
                id={item}
                classn={activeId === String(item) ? 'dragging' : ''}
              />
            ))}
            <div className="Task">+</div>
          </div>
        </SortableContext>
        <DragOverlay></DragOverlay>
      </DndContext>
    );
  }
}

export default TaskList;
