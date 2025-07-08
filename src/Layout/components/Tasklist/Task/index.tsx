import Checkbox from '../../../../components/Checkbox';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../../../../context/para/tasks';
import { Todo } from '../../../../types/todos';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { IconGridDots } from '@tabler/icons-react';
import { useLayoutDialog } from '../../../../context/para/Dialog';

function Task ({
  id,
  classname,
  link,
}: {
  id: number;
  classname: string;
  link?: number;
}) {
  const one = useTasks(state => state.get_one);
  const [task, setTask] = useState({} as Todo);
  const [checked, setChecked] = useState(task.checked || false);
  const dialog = useLayoutDialog(state => state.changeMode);
  const update = useTasks(state => state.update);  
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  useDebounce(
    () => {
      one(String(id), setTask, setChecked).then(() => {});
    },
    200,
    []
  );
  useDebounce(
    () => {
      update(
        {
          id: task.id,
          title: task.title,
          checked,
        },
        setTask,
        setChecked
      );
    },
    10,
    [checked]
  );

  return (
    <div
      className={`${classname} Task rounded-xs`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className='text-sm flex gap-4'>
        <IconGridDots {...listeners} className='cursor-grab' size={'1rem'} />
        <div
          className='cursor-pointer'
          onClick={() => {
            if (!link) {
              dialog('dialog_note', { id: task.note_id as number });
            }else{}
          }}
        >
          {task.title}
        </div>
      </div>
      <Checkbox state={checked} setState={setChecked} />
    </div>
  );
}
export default Task;
