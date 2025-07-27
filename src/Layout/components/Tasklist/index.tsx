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
import Input from '../../../components/Input';
import { IconLink, IconSend2 } from '@tabler/icons-react';
import { useTasks } from '../../../context/para/tasks';
import { useAreas } from '../../../context/para/areas';
import { useDebounce } from 'react-use';
import { SwappingStrategy } from '../../Strategy';
import { useLayoutDialog } from '../../../context/para/Dialog';

function TaskList({ id }: { id: number }) {
  const [schema, setSchema] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const open_dialog = useLayoutDialog(state => state.changeMode);
  const [title, setTitle] = useState<string>('');
  const create_task = useTasks(state => state.create);
  const get_card = useAreas(state => state.get_Card);
  const act = useAreas(state => state.active);
  const [_, forceUpdate] = useState(0);
  useDebounce(
    () => {
      forceUpdate(n => n + 1);
    },
    10,
    [act]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  useDebounce(
    () => {
      let card = get_card(id);
      setSchema(card.props.list);
    },
    500,
    []
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
        <SortableContext items={schema} strategy={SwappingStrategy}>
          <div className='p-2'>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (title != '') {
                  await create_task(title, id);
                  setTitle('');
                }
              }}
              className='cols-full'
            >
              <Input
                placeholder='create a task'
                onChange={setTitle}
                value={title}
                icon={
                  <button type='submit'>
                    <IconSend2 size={'1rem'} />
                  </button>
                }
              />
            </form>
            <div className='task_list overflow-hidden'>
              {schema?.map(item =>
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
    );
  }
}

export default TaskList;
