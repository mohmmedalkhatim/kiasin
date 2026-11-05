import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface props {
  id: number;
  link: string;
  Icon: ReactElement;
  name: string;
}

function Page(item: props) {
  return (
    <Link key={item.id} viewTransition={true} className="link group w-full rounded z-40" to={item.link} aria-label={item.name}>
      <div>{item.Icon}</div>
      <span className="hidden m_border group-hover:block tip" role="tooltip">{item.name}</span>
    </Link>
  );
}
export default Page;
