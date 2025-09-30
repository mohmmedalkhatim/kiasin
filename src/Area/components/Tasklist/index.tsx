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
import { useEffect, useState } from 'react';
import Task from './Task';
import { IconLink } from '@tabler/icons-react';
import { useAreas } from '../../../context/para/areas';
import { SwappingStrategy } from '../../Strategy';
import { useLayoutDialog } from '../../../context/para/Dialog';
import Form from './form';

function TaskList({ id, cols }: { id: number, cols: number | undefined }) {
  const [schema, setSchema] = useState<{ name: string, list: number[] }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const open_dialog = useLayoutDialog(state => state.changeMode);
  const card = useAreas(state => state.get_Card)(id);
  const updateCard = useAreas(state => state.update_card);
  const act = useAreas(state => state.active);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  useEffect(() => {
    if (cols && cols > card.props.columns.length) {
      card.props.columns.push({ name: "untitled", list: [] })
      updateCard(id, card)
    }
    setSchema(card.props.columns);
  }, [cols]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any, column_id: number) => {
    if (event.active.id !== event.over.id) {
      const oldIndex = schema?.indexOf(event.active.id);
      const newIndex = schema?.indexOf(event.over.id);
      const updated = arrayMove(schema, oldIndex, newIndex);
      card.props.columns[column_id].list = updated;
      setSchema(updated);
      updateCard(card.id, card);
    }
    setActiveId(null);
  };
  console.log(cols)
  if (schema) {
    return (
      <div className='flex w-full'>
        {schema.map((column, id) => (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={event => handleDragEnd(event, id)}
          >
            <SortableContext items={column.list} strategy={SwappingStrategy}>
              <div className='p-2 w-full'>
                <Form column_id={id} card_id={card.id} />
                <div className='task_list overflow-hidden'>
                  {column.list?.map(item =>
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
                </div>
                <div
                  className='absolute bottom-5 right-5'
                  onClick={() => open_dialog('dialog_links', { id })}
                >
                  <IconLink size={'1.3rem'} color='gray' />
                </div>
              </div>
            </SortableContext>
            <DragOverlay></DragOverlay>
          </DndContext>
        ))}

      </div>
    );
  }
}

export default TaskList;
