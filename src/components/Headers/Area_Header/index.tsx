import { useEffect, useState } from 'react';
import Input from '../../Input';
import { IconEdit, IconSearch, IconNotebook } from '@tabler/icons-react';
import { useAreas } from '../../../context/para/areas';
import Button from '../../Button';
import { Link } from 'react-router-dom';
import { Area } from '../../../types/area';

function Header () {
  const [search, setSearch] = useState('');
  const toggle = useAreas(state => state.toggleEditable);
  const active = useAreas(state => state.active)?.at(-1);
  let [state, setState] = useState(1);
  const update = useAreas(state => state.update);
  const update_active = useAreas(state => state.update_active_area);
  useEffect(() => {
    setState(state + 1);
  }, [active]);
  return (
    <header className='app_header'>
      <div></div>
      <Input
        type={'text'}
        value={search}
        onChange={() => setSearch}
        icon={<IconSearch size={'1rem'} />}
      />
      <input
        value={active?.title}
        className='outline-none border-none focus:border'
        onChange={e => {
          let area = { ...active, title: e.target.value } as Area;
          update_active(area);
          update(area);
        }}
      />
      <Button
        size='sm'
        className='bg-[#181818]'
        children={
          <>
            edit <IconEdit size={'1.2rem'} />
          </>
        }
        onClick={toggle}
      />
      <Link to={`/note/${active?.note_id}`}>
        <IconNotebook size={'2rem'} />
      </Link>
      <div></div>
    </header>
  );
}
export default Header;
