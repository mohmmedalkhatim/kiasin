import {
  IconCalendarEvent,
  IconDashboard,
  IconDatabase,
  IconLayersIntersect,
  IconNotes,
  IconSettings,
} from '@tabler/icons-react';
import Page from './link';
import { useLayoutDialog } from '../../../context/para/Dialog';

function Links() {
  const { changeMode } = useLayoutDialog()
  const arr = [
    { name: 'dashboard', link: '/', Icon: <IconDashboard /> },
    { name: 'Databases', link: '/databases', Icon: <IconDatabase /> },
    { name: 'Events', link: '/events', Icon: <IconCalendarEvent /> },
    { name: 'areas', link: '/areas', Icon: <IconLayersIntersect /> },
    { name: 'notes', link: '/notes', Icon: <IconNotes /> },
  ];
  return (
    <div className='flex flex-col item-center justify-between h-full pb-20'>
      <div className="links">
        {arr.map((item, i) => (
          <Page id={i} key={i} {...item} />
        ))}
      </div>
      <div className='link group rounded z-40' onClick={() => changeMode("dialog_setting", { id: 0 })}>
        <div>
          <IconSettings />
        </div>
      </div>
    </div>
  );
}
export default Links;
