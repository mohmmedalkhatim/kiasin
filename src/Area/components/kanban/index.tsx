import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import './index.css';
import { arrayMove, rectSwappingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import ColContainer from './column/container';

function Kanban({ id, cols }: { id: number, cols: number | undefined }) {
  const [schema, setSchema] = useState<{ id: number, name: string, list: number[] }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const card = useAreas(state => state.get_Card)(id);
  const updateCard = useAreas(state => state.update_card);
  const act = useAreas(state => state.active);

  const ColSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

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
  const handleColDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    setSchema((prev) => {
      let newSchema = prev.map(col => ({ ...col, list: [...col.list] }));

      const sourceCol = newSchema.find(item => item.id == active.id)
      const targetCol = newSchema.find(item => item.id == over.id)
      if (sourceCol?.id != targetCol?.id && sourceCol && targetCol) {
        const sourceIndex = newSchema.indexOf(sourceCol);
        const targetIndex = newSchema.indexOf(targetCol);
        newSchema = arrayMove(prev, sourceIndex, targetIndex);
        updateCard(id, { ...card, props: { ...card.props, columns: newSchema } });
      }
      return newSchema
    });

    setActiveId(null);
  }

  if (schema) {
    return (
      <div className='flex w-full h-full gap-2 p-2 '>
        <DndContext
          sensors={ColSensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleColDragEnd}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          modifiers={[]}
        >
          <SortableContext items={schema} strategy={rectSwappingStrategy} key={id}>
            {schema.map((column, column_id) => {
              if (cols && cols > column_id) {
                return (
                  <ColContainer id={card.id} column={column} cols={cols} setSchema={setSchema} />
                )
              }
            })}
          </SortableContext>
        </DndContext >
      </div>
    );
  }
}

export default Kanban;
