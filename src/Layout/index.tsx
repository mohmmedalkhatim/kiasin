import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import Grid from './main/Grid';
import Card from './main/Card';
import { Area, Card as Cardtype } from '../types/area';
import { SwappingStrategy } from './Strategy';
import { useAreas } from '../context/para/areas';
import './style.css';
import Cards_menu from './bubble_menu';


export type element_props = {
  type: string,
  content: any,
  cols: number,
  rows: number
}

const Layout = () => {
  let area = useAreas(state => state.active)?.at(-1)
  const [sort, updateSort] = useState(area?.ui_schema.item.map((item) => item.id.toString()));
  const [activeId, setActiveId] = useState<string | null>(null);
  const  update_active_area = useAreas(state=>state.update_active_area)
  const update = useAreas((state) => state.update);
  const editable = useAreas((state) => state.editable);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    if (event.active.id !== event.over.id && sort) {
      const oldIndex = sort?.indexOf(event.active.id);
      const newIndex = sort?.indexOf(event.over.id);
      const newSort = arrayMove(sort, oldIndex, newIndex);
      const newSchema = newSort.map(
        (id) =>
          area?.ui_schema.item?.find((item) => String(item.id) == id) || ({} as Cardtype)
      );
      update_active_area({ ...area, ui_schema: { item: newSchema } } as Area)
      update({ ...area, ui_schema: { item: newSchema } } as Area);
      updateSort(newSort);
    }
    setActiveId(null);
  };
  const handlesizeChange = (
    id: number,
    operation: { Col: 'col' | 'row'; increase: boolean }
  ) => {
    const card = area?.ui_schema.item?.find((item) => id == item.id);
    const filetred = area?.ui_schema.item?.filter((item) => item?.id != id) as Cardtype[];
    if (card) {
      switch (operation.Col) {
        case 'col': {
          if (operation.increase) {
            card.cols = card.cols + 1;
          } else {
            card.cols = Math.max(1, card.cols - 1);
          }
          break;
        };
        case 'row': {
          if (operation.increase) {
            card.rows = card.rows + 1;
          } else {
            card.rows = Math.max(1, card.rows - 1);
          }
          break;
        };
        default:
          () => { };
      }
      const newschema = [...filetred, card];
      const sorted = sort?.map((id) => {
        return newschema?.find((item) => item.id == Number(id)) as Cardtype;
      }) as Cardtype[];
      let uparea = { ...area, ui_schema: { item: sorted } } as Area
      update_active_area(uparea);
      update(uparea);
    }
  };

  if (sort && area?.ui_schema.item) {
    const handleadding = (ele: element_props) => {
      let { cols, rows, type, content } = ele;
      const newSchema = {
        item: [
          ...area?.ui_schema.item,
          { id: area?.ui_schema.item?.length, cols, rows, title: 'new', type, props: content },
        ],

      };
      console.log(newSchema.item);
      let uparea ={ ...area, ui_schema: newSchema } as Area;
      update_active_area(uparea);
      update(uparea);
      updateSort([...sort, String(area.ui_schema.item?.length)]);
    };
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sort} strategy={SwappingStrategy}>
          <Grid columns={8}>
            {area.ui_schema.item?.map((item) => (
              <Card
                setSort={updateSort}
                cla={activeId === String(item.id) ? 'dragging' : ''}
                key={String(item.id)}
                id={String(item.id)}
                card={item}
                setCardlist={handlesizeChange} />
            ))}
            {editable ? (
              <Cards_menu handleadding={handleadding} />
            ) : null}
          </Grid>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <Card
              cla=""
              setCardlist={() => { }}
              id={activeId}
              card={undefined}
              setSort={updateSort}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }
};

export default Layout;
