import './index.css';
import { useAside } from '../../context/aside';
import { IconChevronsRight } from '@tabler/icons-react';
import Button from '../Button';
import Notes_templates from './notes_templates';
import Areas_templates from './areas_templates';
import DBConfig from './DbConfig';

function Aside() {
  const active = useAside((state) => state.active);
  const toggle = useAside((state) => state.toggle);
  const inside = new Map([
    ['notes', <Notes_templates />],
    ['areas', <Areas_templates />],
    ['DBConfig', <DBConfig />],
  ]);
  const type = useAside((state) => state.Type);
  return (
    <>
    <aside className={`${active && 'hide'} Aside`}>
      <div className="aside_header">
        <Button children={<IconChevronsRight />} className='p-2' onClick={() => toggle('')} />
      </div>
      <div className="content_container">{inside.get(type)}</div>
    </aside>
    </>
  );
}
export default Aside;
