import { useRef, useState } from 'react';
import {
  IconCalendar,
  IconCalendarEvent,
  IconChevronDown,
  IconChevronRight,
  IconDeviceWatch,
  IconDeviceWatchStats,
  IconGrid4x4,
  IconList,
  IconLoader,
  IconPhoto,
  IconSearch,
  IconWriting,
} from '@tabler/icons-react';
import { element_props } from '..';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { CSSTransition } from 'react-transition-group';
import "./style.css"

function Cards_menu({
  handle_adding,
}: {
  handle_adding: (ele: element_props) => void;
}) {
  const [open, setOpen] = useState(false)
  const [menu, setmenu] = useState("main");
  const nodeRef = useRef(null);
  const listRef = useRef(null);


  return (
    <>
      <Button className='w-full z-90   mb-2 text-center flex items-center justify-between' onClick={e => setOpen(prv => !prv)}>
        <div>create new</div>
        <div>
          {menu ? <IconChevronDown size={'1.2rem'} /> : <IconChevronRight />}
        </div>
      </Button>
      <CSSTransition
        nodeRef={nodeRef}
        in={open}
        timeout={600}                 // <-- matches CSS transition: 600ms
        classNames="slide"
        unmountOnExit
        appear                         // animate on first mount if open initially
      >
        <div ref={nodeRef} className="menu" style={{ right: 15, top: 150 }}>
          <TheMenu handle_adding={handle_adding} action={() => setOpen(false)} />
        </div>
      </CSSTransition>
    </>
  );
}
export default Cards_menu;

function TheMenu({
  handle_adding,
  action
}: {
  handle_adding: (ele: element_props) => void;
  action: () => void;
}) {
  const map = [
    {
      name: 'Areaslist',
      props: {
        min_cols: 2,
        min_rows: 3,
      },
      content: { list: [] },
      icon: <IconGrid4x4 size={'1.4rem'} />,
    },
    {
      name: 'editor',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconWriting size={'1.4rem'} />,
    },
    {
      name: 'tasks',
      props: {
        min_cols: 1,
        min_rows: 3,
      },
      content: { list: [], columns: [{name:"untitled",list:[]}] },
      icon: <IconList size={'1.4rem'} />,
    },
    {
      name: 'calender',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: { list: [1, 2] },
      icon: <IconCalendar size={'1.4rem'} />,
    },
    {
      name: 'image',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconPhoto size={'1.4rem'} />,
    },
    {
      name: 'LoadingBar',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconLoader size={'1.4rem'} />,
    },
    {
      name: 'Timer',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconDeviceWatch size={'1.4rem'} />,
    },
    {
      name: 'Status',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconDeviceWatchStats size={'1.4rem'} />,
    },
    {
      name: 'Timeline',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconCalendarEvent size={'1.4rem'} />,
    },
  ];
  return (
    <div
      className={`flex flex-col items-center  justify-center`}
    >
      <div className='w-full px-4 py-4 '>
        <Input
          placeholder='Search'
          icon={<IconSearch size={'1rem'} color='#e2e2e260' />}
        />
      </div>
      <nav className='grid grid-cols-3 gap-x-2 w-full pb-2'>
        {map.map(item => (
          <div
            className='flex justify-center items-center w-full h-14   hover:bg-[#e2e2e220]  hover:-translate-y-0.5  cursor-pointer'
            onClick={() =>
              handle_adding({
                cols: item.props.min_cols,
                rows: item.props.min_rows,
                type: item.name,
                content: item.content,
              })
            }
          >
            {item.icon}
          </div>
        ))}
      </nav>
      <Button
        className='rounded-none w-full border-none text-center text-xs'
        type='reset'
        onClick={() => action()}
      >
        Browser All
      </Button>
    </div>
  )
}
