import './style.css';
import Links from './Links';
import Profile_link from './profile';

function Aside() {
  return (
    <nav className="navbar">
      <Profile_link />
      <Links />
    </nav>
  );
}
export default Aside;
