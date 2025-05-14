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
import Input from '../../../components/Input';
import { IconSend, IconSend2 } from '@tabler/icons-react';
import { useTasks } from '../../../context/para/tasks';
import Button from '../../../components/Button';
import { useAreas } from '../../../context/para/areas';
import { Todo } from '../../../types/todos';

function TaskList({ id }: { id:number }) {
  const [schema, setSchema] = useState([] as Todo[]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState<string >("");
  const create_task = useTasks(state=>state.create)
  const set_Card = useAreas(state=>state.update_card);
  const get_card = useAreas(state=>state.get_Card);

  useEffect(()=>{
    console.log(get_card(id))
  },[])

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
            <form action={()=>create_task(title)}>
                <Input placeholder='create a task' onChange={setTitle}  icon={<button type='submit'><IconSend2  size={"1rem"}/></button>}/>
            </form>
            {schema?.map((item) => (
              <Task
                id={item.id}
                key={item.id}
                classn={activeId === String(item) ? 'dragging' : ''}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay></DragOverlay>
      </DndContext>
    );
  }
}

export default TaskList;
