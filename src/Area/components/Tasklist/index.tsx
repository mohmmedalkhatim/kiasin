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
  let [_, setRender] = useState(0);
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
  }, [act, cols]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any, column_id: number) => {
    if (event.active.id !== event.over.id) {
      const oldIndex = schema[column_id].list?.indexOf(event.active.id);
      const newIndex = schema[column_id].list?.indexOf(event.over.id);
      let temp = [...schema[column_id].list];
      const updated = arrayMove(temp, oldIndex, newIndex);
      card.props.columns[column_id].list = [...updated];
      setSchema(state => {
        let temp = state;
        temp[column_id].list = [...updated]
        return temp;
      });
      updateCard(card.id, card);
    }
    setActiveId(null);
  };
  if (schema) {
    return (
      <div className='flex w-full'>
        {schema.map((column, id) => {
          if (cols && cols > id) {
            return (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={event => handleDragEnd(event, id)}
              >
                <SortableContext items={column.list} strategy={SwappingStrategy}>
                  <div className='p-2 w-full'>
                    <Form column_id={id} card_id={card.id} setActive={setRender} />
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
                  <DragOverlay></DragOverlay>
                </SortableContext>
              </DndContext>
            )
          }
        })}

      </div>
    );
  }
}

export default TaskList;
