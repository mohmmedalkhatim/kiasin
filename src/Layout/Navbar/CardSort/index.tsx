import { useSortable } from '@dnd-kit/sortable';
import { IconGridDots } from '@tabler/icons-react';
import { CSS } from '@dnd-kit/utilities';
import { useAreas } from '../../../context/para/areas';
function CardSort ({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const card = useAreas(state=>state.get_Card)(Number(id));
  return (
    <div ref={setNodeRef} className='flex item-center rounded gap-4 m_border py-3 px-4' style={style} {...attributes}>
      <div className='cursor-grab' {...listeners}>
        <IconGridDots />
      </div>
      <div>{card.type}</div>
    </div>
  );
}
export default CardSort;
