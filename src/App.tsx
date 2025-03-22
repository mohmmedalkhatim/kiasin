import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { useEffect } from 'react'
import { useAuth } from './context/User'
import Login from './screens/login'
import { useAreas } from './context/para/areas'

function App(){
  const email = useAuth((state) => state.email);
  const auth = useAuth((state) => state.auth);

  const areas = useAreas(state => state.init);

  const page = (
    <>
      <Header />
      <Outlet />
      <Aside />
    </>
  );
  const login = <Login />;

  const content = email === '' ? login : page;

  useEffect(() => {
    auth();
    areas();
  }, [auth, areas]);

  return (
    <>
      {content}
    </>
  );
}

export default App;