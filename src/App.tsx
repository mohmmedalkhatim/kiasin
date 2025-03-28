import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { useEffect, useState } from 'react'
import { useAuth } from './context/User'
import Login from './screens/login'
import { useAreas } from './context/para/areas'
import Navbar from './components/Navbar';
import { useAside } from './context/aside'
function App() {
  const email = useAuth((state) => state.email);
  const auth = useAuth((state) => state.auth);
  const [done, setdone] = useState(false)
  const areas = useAreas(state => state.init);
  const [aside_state, t] = useAside(state => ([state.active, state.T]))
  const page = (
    <>
      <Header />
      <Outlet />
      <Navbar />
      <Aside active={aside_state} T={t} />
    </>
  );
  const login = <Login />;

  const content = email === '' ? login : page;

  useEffect(() => {
    auth(setdone);
    areas();
  }, [auth, areas]);

  return (
    <>
      {content}
    </>
  );
}

export default App;