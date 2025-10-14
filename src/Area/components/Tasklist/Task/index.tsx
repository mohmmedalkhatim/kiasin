import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../../../../context/para/tasks';
import { Todo } from '../../../../types/todos';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { IconGridDots } from '@tabler/icons-react';
import { useLayoutDialog } from '../../../../context/para/Dialog';

function Task({
  id,
  classname,
  link,
}: {
  id: number;
  classname: string;
  link?: number;
}) {
  const one = useTasks(state => state.get_one);
  const [task, setTask] = useState<Todo | undefined>();
  const [checked, setChecked] = useState(task?.checked || false);
  const dialog = useLayoutDialog(state => state.changeMode);
  const update = useTasks(state => state.update);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  useDebounce(() => {
    if (!task) {
      one(String(id), setTask, setChecked).then(() => { });
    }
    return task
  }, 20, [])
  useDebounce(
    () => {
      if (task) {
        update(
          {
            id: task?.id,
            title: task?.title,
            checked,
            note_id: task?.note_id,
          },
          setTask,
          setChecked
        );
      }
    },
    10,
    [checked]
  );
  let open = () => {
    if (!link) {
      dialog('dialog_note', { id: task?.note_id as number });
    } else { }
  }
  if (task) {
    return (
      <div
        className={`${classname} Task rounded-xs`}
        ref={setNodeRef}
        style={style}
        {...attributes}
      >
        <div className='text-sm flex gap-4 group items-center'>
          <IconGridDots {...listeners} className='cursor-grab' size={'1.08rem'} />
          <div
            className='cursor-pointer text-[12px]'
          >
            <input className='p-0 outline-none border-none' value={task.title} onChange={(e) => {
              update(
                {
                  id: task?.id as number,
                  title: e.target.value,
                  checked,
                  note_id: task?.note_id,
                },
                setTask,
                setChecked
              );
            }}></input>
          </div>

        </div>
      </div>
    );
  }
}
export default Task;
