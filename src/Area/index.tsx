import { Container } from './main/Grid';
import Card from './main/Card';
import './style.css';
import Navbar from './Navbar';
import useLayout from './Hooks/useLayout';
import { useEffect, useState } from 'react';
import { getCurrentWindow, LogicalPosition } from '@tauri-apps/api/window';
import Heading from '../components/Heading';

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
  let content = () => {
    if (area?.ui_schema.item.length !== 0) {
      return area?.ui_schema.item?.map(item => (
        <Card
          setSort={updateSort}
          container_width={rect.width}
          cla={activeId === String(item.id) ? 'dragging' : ''}
          key={String(item.id)}
          id={String(item.id)}
          card={item}
          setCardlist={handlesizeChange}
        />
      ))
    } else {
      return <div className=' col-span-full row-span-8 flex items-center justify-center flex-col'>
        <div>
          press the edit button for more option
        </div>
        <Heading level='1'>
          hello, try adding card's to this area
        </Heading>
      </div>
    }
  }
  let [clicked, setClicked] = useState(false)
  useEffect(() => {
    let header = document.querySelector("header")
    if (header) {
      header.onmousedown = (e) => {
        let window = getCurrentWindow()
        window.setPosition(new LogicalPosition({ x: e.x, y: e.y }))
        setClicked(true)
      }
      header.onmouseup = (e) => {
        setClicked(false)
      }
    }
  }, [])
  return (
    <>
      <Container ref={ref}>
        {content()}
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
