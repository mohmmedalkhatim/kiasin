import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Container } from './main/Grid';
import Card from './main/Card';
import { Area, Card as Cardtype } from '../types/area';
import { useAreas } from '../context/para/areas';
import './style.css';
import { useMeasure } from 'react-use';
import Navbar from './Navbar';

export type element_props = {
  type: string;
  content: any;
  cols: number;
  rows: number;
};

const Layout = () => {
  let active = useAreas(state => state.active);
  let area = active?.at(-1);
  let [ref, rect] = useMeasure();
  const [sort, updateSort] = useState(
    area?.ui_schema.item.map(item => item.id.toString())
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const update_active_area = useAreas(state => state.update_active_area);
  const update = useAreas(state => state.update);
  const editable = useAreas(state => state.editable);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    if (event.active.id !== event.over.id && sort) {
      const oldIndex = sort?.indexOf(event.active.id);
      const newIndex = sort?.indexOf(event.over.id);
      const newSort = arrayMove(sort, oldIndex, newIndex);
      const newSchema = newSort.map(
        id =>
          area?.ui_schema.item?.find(item => String(item.id) == id) ||
          ({} as Cardtype)
      );
      update_active_area({ ...area, ui_schema: { item: newSchema } } as Area);
      update({ ...area, ui_schema: { item: newSchema } } as Area);
      updateSort(newSort);
    }
    setActiveId(null);
  };
  const handlesizeChange = (
    id: number,
    operation: { Col: 'col' | 'row'; increase: boolean }
  ) => {
    const card = area?.ui_schema.item?.find(item => id == item.id);
    const filetred = area?.ui_schema.item?.filter(
      item => item?.id != id
    ) as Cardtype[];
    if (card) {
      switch (operation.Col) {
        case 'col': {
          if (operation.increase) {
            card.cols = Math.min(4, card.cols + 1);
          } else {
            card.cols = Math.max(1, card.cols - 1);
          }
          break;
        }
        case 'row': {
          if (operation.increase) {
            card.rows = card.rows + 1;
          } else {
            card.rows = Math.max(1, card.rows - 1);
          }
          break;
        }
        default:
          () => {};
      }
      const newschema = [...filetred, card];
      const sorted = sort?.map(id => {
        return newschema?.find(item => item.id == Number(id)) as Cardtype;
      }) as Cardtype[];
      let UpdateArea = { ...area, ui_schema: { item: sorted } } as Area;
      update_active_area(UpdateArea);
      update(UpdateArea);
    }
  };

  if (sort && area?.ui_schema.item) {
    const handleadding = (ele: element_props) => {
      let { cols, rows, type, content } = ele;
      const newSchema = {
        item: [
          ...area?.ui_schema.item,
          {
            id: area?.ui_schema.item?.length,
            cols,
            rows,
            title: 'new',
            type,
            props: content,
          },
        ],
      };
      let UpdateArea = { ...area, ui_schema: newSchema } as Area;
      update_active_area(UpdateArea);
      update(UpdateArea);
      updateSort([...sort, String(area.ui_schema.item?.length)]);
    };
    return (
      <>
        <Container ref={ref}>
          {area.ui_schema.item?.map(item => (
            <Card
              setSort={updateSort}
              container_width={rect.width}
              cla={activeId === String(item.id) ? 'dragging' : ''}
              key={String(item.id)}
              id={String(item.id)}
              card={item}
              setCardlist={handlesizeChange}
            />
          ))}
          {editable && (
            <Navbar
              start={handleDragStart}
              create={handleadding}
              end={handleDragEnd}
              state={editable}
              schema={sort}
            />
          )}
        </Container>
      </>
    );
  }
};

export default Layout;
