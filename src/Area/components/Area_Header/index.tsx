import { useEffect, useState } from 'react';
import { IconDeviceFloppy, IconEdit,  IconNotebook } from '@tabler/icons-react';
import { useAreas } from '../../../context/para/areas';
import { Link } from 'react-router-dom';
import { Area } from '../../../types/area';
import { useNotes } from '../../../context/para/notes';
import { Note } from '../../../types/notes';
import Button from '../../../components/Button';

function Header() {
  const toggle = useAreas(state => state.toggleEditable);
  const editable = useAreas(state => state.editable);
  const active = useAreas(state => state.active)?.at(-1);
  const update = useAreas(state => state.update);
  const update_active = useAreas(state => state.update_active_area);
  const area_note = useNotes(state => state.active);
  const setActive = useNotes(state => state.note);
  const update_note = useNotes(state => state.updata_note);
  const [_, setDone] = useState<Note>();
  useEffect(() => {
    if (active?.note_id) {
      setActive(active.note_id, setDone);
    }
  }, []);
  return (
    <header>
      <input
        value={active?.title}
        className='outline-none border-none font-semibold font focus:border'
        onChange={e => {
          let area = { ...active, title: e.target.value } as Area;
          if (active?.note_id) {
            update_note(active?.note_id, { ...area_note, title: e.target.value })
          }
          update_active(area);
          update(area);
        }}
      />
      <div></div>
      <div></div>
      <div></div>

      <Link viewTransition to={`/note/${active?.note_id}`}>
        <IconNotebook size={'2rem'} />
      </Link>
      <Button
        size='sm'
        className='bg-[#181818]'

        children={
          <>
            {editable?(<>save <IconDeviceFloppy size={'1.2rem'} /></>):<>edit <IconEdit size={'1.2rem'} /></>}
          </>
        }
        onClick={toggle}
      />
      <div></div>
    </header>
  );
}
export default Header;
