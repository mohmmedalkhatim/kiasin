import { Container } from './main/Grid';
import Card from './main/Card';
import './style.css';
import Navbar from './Navbar';
import useLayout from './Hooks/useLayout';

export type element_props = {
  type: string;
  content: any;
  cols: number;
  rows: number;
};

const Layout = () => {
  let {
    ref,
    handleDragEnd,
    handleDragStart,
    handlesizeChange,
    handleadding,
    editable,
    rect,
    area,
    updateSort,
    activeId,
    sort,
  } = useLayout();
  return (
    <>
      <Container ref={ref}>
        {area?.ui_schema.item?.map(item => (
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
            schema={sort as string[] | []}
          />
        )}
      </Container>
    </>
  );
};

export default Layout;
