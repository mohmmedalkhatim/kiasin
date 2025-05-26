import { Outlet } from 'react-router-dom';
import Aside from './components/Aside';
import './App.css';
import { useEffect } from 'react';
import { useAuth } from './context/User';
import { useAreas } from './context/para/areas';
import Navbar from './components/Navbar';
import { useNotes } from './context/para/notes';
function App() {
  const areas = useAreas((state) => state.init);
  const init = useAreas((state) => state.init);
  let initNotes = useNotes((state) => state.init);

  useEffect(() => {
    init();
    initNotes();
  }, []);

  useEffect(() => {
    areas();
  }, [areas]);

  return (
    <>
      <Outlet />
      <Navbar />
      <Aside />
    </>
  );
}

export default App;
