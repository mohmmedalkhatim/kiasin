import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  KeyboardSensor,
  PointerSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import CardSort from './CardSort';
import Cards_menu from '../bubble_menu';
import { element_props } from '..';

interface Navbar_props {
  start: (event: any) => void;
  end: (event: any) => void;
  state: boolean;
  schema: string[];
  create: (element: element_props) => void;
}

function Navbar ({ start, end, state, schema, create }: Navbar_props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <nav
      className='fixed w-[16rem] transition-all duration-150 h-screen z-60 pt-24 px-4  bg-[#181818] m_border'
      style={{ top: 0, right: state ? '0' : '9999px' }}
    >
      <Cards_menu handleadding={create} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={start}
        onDragEnd={end}
      >
        <SortableContext items={schema} strategy={verticalListSortingStrategy}>
          <div className='flex flex-col gap-2  select-none'>
            {schema?.map(item => (
              <CardSort id={item} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay></DragOverlay>
      </DndContext>
    </nav>
  );
}
export default Navbar;
