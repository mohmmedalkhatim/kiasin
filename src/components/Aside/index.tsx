import './index.css';
import { useAside } from '../../context/aside';
import { IconChevronsRight } from '@tabler/icons-react';
import Button from '../Button';
import Notes_templates from './notes_templates';
import Areas_templates from './areas_templates';

function Aside() {
  const active = useAside((state) => state.active);
  const toggle = useAside((state) => state.toggle);
  const inside = new Map([
    ['notes', <Notes_templates />],
    ['areas', <Areas_templates />],
  ]);
  const t = useAside((state) => state.t);
  return (
    <aside className={`${active && 'hide'} Aside`}>
      <div className="aside_header">
        <Button children={<IconChevronsRight />} onClick={() => toggle('')} />
      </div>
      <div className="content_container">{inside.get(t)}</div>
    </aside>
  );
}
export default Aside;
