import './index.css';
import { useAside } from '../../context/aside';
import { IconChevronsRight } from '@tabler/icons-react';
import Button from '../Button';

function Aside({
  active,
}: {
  active: boolean;
}) {
  const toggle = useAside((state) => state.toggle);
  const inside = new Map([["notes", <div>notes</div>], ["areas", <div>areas</div>]])
  const t = useAside((state) => state.t);

  return (
    <aside className={`${active && 'hide'} Aside`}>
      <div className="aside_header">
        <Button children={<IconChevronsRight />} onClick={() => toggle("")} />
      </div>
      <div className="content_container">{inside.get(t)}</div>
    </aside>
  );
}
export default Aside;
