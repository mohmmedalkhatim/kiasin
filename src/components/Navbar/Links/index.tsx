import { Link } from 'react-router-dom';
import {
  IconDashboard,
  IconLayersIntersect,
  IconNotes,
} from '@tabler/icons-react';

function Links() {
  const arr = [
    { name: 'Dashboard', link: '/', Icon: <IconDashboard /> },
    { name: 'areas', link: '/areas', Icon: <IconLayersIntersect /> },
    { name: 'Notes', link: '/notes', Icon: <IconNotes /> },
    { name: 'DataTree', link: '/' },
  ];
  return (
    <div className="links">
      {arr.map((item, i) => (
        <Link key={i} className="link" to={item.link}>
          <div>{item.Icon}</div>
          <div className="hidden md:block">{item.name}</div>
        </Link>
      ))}
    </div>
  );
}
export default Links;
