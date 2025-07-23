import { Outlet } from 'react-router-dom';
import Aside from './components/Aside';
import './App.css';
import { useEffect } from 'react';
import { useAreas } from './context/para/areas';
import Navbar from './components/Navbar';
import { useNotes } from './context/para/notes';
import Dialog from './Layout/Dialog';
import BubbleMenu from './App_bubble';

function App() {
  const init = useAreas((state) => state.init);
  let initNotes = useNotes((state) => state.init);

  useEffect(() => {
    init();
    initNotes();
  }, []);


  return (
    <>
      <BubbleMenu />
      <Outlet />
      <Navbar />
      <Aside />
      <Dialog />
    </>
  );
}

export default App;
