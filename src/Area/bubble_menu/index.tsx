import { MouseEventHandler, useRef, useState } from 'react';
import {
  IconCalendar,
  IconChevronDown,
  IconChevronRight,
  IconClock,
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

const calculate_menu_appernce = (y: number): number => {
  let pos = 0;
  if (y <= 300) {
    pos = 72;
  } else {
    pos = 260;
  }
  return pos;
};

function Cards_menu({
  handleadding,
}: {
  handleadding: (ele: element_props) => void;
}) {
  const [menu, setmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const map = [
    {
      name: 'Areaslist',
      props: {
        min_cols: 2,
        min_rows: 3,
      },
      content: { list: [] },
      icon: <IconGrid4x4 size={'1.7rem'} />,
    },
    {
      name: 'editor',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconWriting size={'1.7rem'} />,
    },
    {
      name: 'tasks',
      props: {
        min_cols: 1,
        min_rows: 3,
      },
      content: { list: [] },
      icon: <IconList size={'1.7rem'} />,
    },
    {
      name: 'calender',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: { list: [1, 2] },
      icon: <IconCalendar size={'1.7rem'} />,
    },
    {
      name: 'image',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconPhoto size={'1.7rem'} />,
    },
    {
      name: 'LoadingBar',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconLoader size={'1.7rem'} />,
    },
    {
      name: 'Timer',
      props: {
        min_cols: 1,
        min_rows: 4,
      },
      content: '',
      icon: <IconClock size={'1.7rem'} />,
    },
  ];

  return (
    <>
      <Button className='w-full z-90  mb-2 text-center flex items-center justify-between' onClick={e => setmenu(!menu)}>
        <div>create new</div>
        <div>
          {menu ? <IconChevronDown size={'1.2rem'} /> : <IconChevronRight />}
        </div>
      </Button>
      <CSSTransition nodeRef={menuRef} in={menu} timeout={200} classNames="bubble_main" unmountOnExit>
        <div
          ref={menuRef}
          className={`${menu ? 'menu w-full' : 'hidden'} z-1000`}
        >
          <div className='pt-4 px-4'>
            <Input
              placeholder='Search'
              icon={<IconSearch size={'1rem'} color='#e2e2e260' />}
            />
          </div>
          <nav className='elements_container'>
            {map.map(item => (
              <div
                className='flex justify-center cursor-pointer items-center'
                onClick={() =>
                  handleadding({
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
            className='rounded-none border-none text-center text-xs'
            type='reset'
          >
            Browser All
          </Button>
        </div>
      </CSSTransition>
    </>
  );
}
export default Cards_menu;
