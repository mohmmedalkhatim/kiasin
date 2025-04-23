import { useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Task({ id, classn }: { id: number; classn: string }) {
  const [checked, setChecked] = useState(false);
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
  return (
    <div
      className={`${classn} Task rounded-xs`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div>Task</div>
      <Checkbox state={checked} setState={setChecked} title={''} />
    </div>
  );
}
export default Task;
