import { useState } from 'react';
import Input from '../../Input';
import { IconEdit, IconSearch, IconNotebook } from '@tabler/icons-react';
import { useAreas } from '../../../context/para/areas';
import Button from '../../Button';
import { Link } from 'react-router-dom';

function Header () {
  const [search, setSearch] = useState('');
  const toggle = useAreas(state => state.toggleEditable);
  const active = useAreas(state => state.active)?.at(-1);
  return (
    <header className='app_header'>
      <div></div>
      <Input
        type={'text'}
        value={search}
        onChange={() => setSearch}
        icon={<IconSearch size={'1rem'} />}
      />
      <div>{active?.title}</div>
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
