import { Link } from 'react-router-dom';
import {
  IconDashboard,
  IconDatabase,
  IconLayersIntersect,
  IconNotes,
} from '@tabler/icons-react';
import Page from './link';

function Links() {
  const arr = [
    { name: 'dashboard', link: '/', Icon: <IconDashboard /> },
    { name: 'areas', link: '/areas', Icon: <IconLayersIntersect /> },
    { name: 'notes', link: '/notes', Icon: <IconNotes /> },
    { name: 'dataTree', link: '/' ,Icon:<IconDatabase/>},
  ];
  return (
    <div className="links">
      {arr.map((item, i) => (
        <Page id={i} {...item} />
      ))}
    </div>
  );
}
export default Links;
