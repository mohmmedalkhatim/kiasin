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
import { IconLink, IconPlus } from '@tabler/icons-react';
import { useAreas } from '../../../context/para/areas';
import { SwappingStrategy } from '../../Strategy';
import { useLayoutDialog } from '../../../context/para/Dialog';
import Form from './form';
import { useTasks } from '../../../context/tasks';

function TaskList({ id, cols }: { id: number, cols: number | undefined }) {
  const [schema, setSchema] = useState<{ id: number, name: string, list: number[] }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const create_task = useTasks(state => state.create);
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
    setSchema((items) => {
      items.map(column => {
        active
      })
      return items
    })
  };

  if (schema) {
    return (
      <div className='flex w-full'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {schema.map((column, column_id) => {
            if (cols && cols > column_id) {
              return (
                <SortableContext items={column.list} strategy={SwappingStrategy}>
                  <div className='p-2 w-full'>
                    <Form column_id={column_id} title={column.name} setActive={setRender} card_id={id} />
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
                      <div className='flex items-center gap-2 px-4 py-2' onClick={() => create_task("", card.id, column_id)}>
                        <div className='text-[#e2e2e230]'><IconPlus size={"0.9rem"} /></div>
                        <div className='text-[#e2e2e230] text-xs'>New</div>
                      </div>
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
              )
            }
          })}

        </DndContext>

      </div >
    );
  }
}

export default TaskList;
