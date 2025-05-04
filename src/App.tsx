import { Outlet } from 'react-router-dom';
import Aside from './components/Aside';
import './App.css';
import { useEffect } from 'react';
import { useAuth } from './context/User';
import Login from './screens/login';
import { useAreas } from './context/para/areas';
import Navbar from './components/Navbar';
import { useNotes } from './context/para/notes';
function App() {
  const email = useAuth((state) => state.email);
  const auth = useAuth((state) => state.auth);
  const areas = useAreas((state) => state.init);
  const init = useAreas((state) => state.init);
  let initNotes = useNotes((state) => state.init);

  useEffect(() => {
    init();
    initNotes();
  }, []);
  const page = (
    <>
      <Outlet />
      <Navbar />
      <Aside />
    </>
  );
  const login = <Login />;

  const content = email === '' ? login : page;

  useEffect(() => {
    auth(() => {});
    areas();
  }, [auth, areas]);

  return content;
}

export default App;
