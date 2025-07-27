import './style.css';
import Links from './Links';
import Profile_link from './profile';
import { useAreas } from '../../context/para/areas';

function Navbar () {
  const active = useAreas(state => state.editable);
  return (
    <>
      <nav className={!active ? 'navbar' : 'navbar -left-24'}>
        <Profile_link />
        <Links />
      </nav>
    </>
  );
}
export default Navbar;
