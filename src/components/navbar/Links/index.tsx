import {
  IconDashboard,
  IconDatabase,
  IconForms,
  IconLayersIntersect,
  IconNotes,
  IconSettings,
} from '@tabler/icons-react';
import Page from './link';

function Links() {
  const arr = [
    { name: 'dashboard', link: '/', Icon: <IconDashboard size={"1.5rem"}/> },
    { name: 'databases', link: '/databases', Icon: <IconDatabase size={"1.5rem"} /> },
    { name: 'Form builder', link: '/form_builder', Icon: <IconForms size={"1.5rem"} /> },
    { name: 'areas', link: '/areas', Icon: <IconLayersIntersect size={"1.5rem"}/> },
    { name: 'notes', link: '/notes', Icon: <IconNotes size={"1.5rem"} /> },
  ];
  return (
    <div className='flex flex-col item-center justify-between h-full pb-20'>
      <div className="links">
        {arr.map((item, i) => (
          <Page id={i} key={i} {...item} />
        ))}
      </div>
      <button className="link group rounded z-40" title="Settings" aria-label="Settings">
        <div>
          <IconSettings />
        </div>
      </button>
    </div>
  );
}
export default Links;
