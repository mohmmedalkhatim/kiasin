import Checkbox from '../../../../components/Checkbox';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../../../../context/para/tasks';
import { Todo } from '../../../../types/todos';
import { useEffect, useState } from 'react';

function Task({ id, classname }: { id: number; classname: string }) {
  const one = useTasks((state) => state.get_one);
  const [task, setTask] = useState({} as Todo);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  useEffect(() => {
    one(String(id), setTask).then(() => {
      console.log(task);
    });
  }, []);

  return (
    <div
      className={`${classname} Task rounded-xs`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="text-sm">{task.title}</div>
      <Checkbox state={task.checked} setState={() => {}} title={task.title} />
    </div>
  );
}
export default Task;
