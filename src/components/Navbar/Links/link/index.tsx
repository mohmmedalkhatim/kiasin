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
    <Link key={item.id} className="link group rounded z-40" to={item.link}>
      <div>{item.Icon}</div>
      <div className="hidden m_border group-hover:block tip">{item.name}</div>
    </Link>
  );
}
export default Page;
