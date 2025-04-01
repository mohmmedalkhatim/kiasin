import { useState } from 'react';
import Input from '../Input';
import { IconEdit } from '@tabler/icons-react';
import { useAreas } from '../../context/para/areas';

function Header() {
  const [search, setSearch] = useState();
  const taggle = useAreas((state) => state.taggleEditable);
  return (
    <header className="app_header">
      <div></div>
      <Input
        type={'text'}
        props={search}
        action={(e) => {
          setSearch(e.target.value);
        }}
      />
      <div></div>
      <button onClick={taggle}>
        edit{' '}
        <span>
          <IconEdit size={'1rem'} />
        </span>
      </button>
      <div></div>
    </header>
  );
}
export default Header;
