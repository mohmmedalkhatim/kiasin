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
import { IconSend2 } from '@tabler/icons-react';
import { useTasks } from '../../../context/para/tasks';
import { useAreas } from '../../../context/para/areas';
import { useDebounce } from 'react-use';

function TaskList ({ id }: { id: number }) {
  const [schema, setSchema] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const create_task = useTasks(state => state.create);
  const get_card = useAreas(state => state.get_Card);
  const act = useAreas(state=>state.active)
  const [_, forceUpdate] = useState(0);
  useDebounce(() => {
    forceUpdate(n => n + 1);
  },300, [act]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );
  useDebounce(() => {
    let card = get_card(id);
    setSchema(card.props.list);
  },500, []);

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
          <div className='list'>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (title != '') {
                  await create_task(title, id);
                  setTitle('')
                }
              }}
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
        </SortableContext>
        <DragOverlay></DragOverlay>
      </DndContext>
    );
  }
}

export default TaskList;
