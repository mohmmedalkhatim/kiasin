import './index.css';
import { useAside } from '../../context/aside';
import { IconChevronsRight } from '@tabler/icons-react';
import Button from '../Button';
import { ReactElement } from 'react';

function Aside({
  active,
  children,
}: {
  active: boolean;
  children: ReactElement | ReactElement[] | string;
}) {
  const toggle = useAside((state) => state.toggle);
  return (
    <aside className={`${active && 'hide'} Aside`}>
      <div className="aside_header">
        <Button children={<IconChevronsRight />} onClick={toggle} />
      </div>
      <div className="content_container">{children}</div>
    </aside>
  );
}
export default Aside;
