import { Outlet } from 'react-router-dom';
import Aside from './components/Aside';
import './App.css';
import { useEffect } from 'react';
import { useAreas } from './context/para/areas';
import Navbar from './components/Navbar';
import { useNotes } from './context/para/notes';
import Dialog from './Area/Dialog';
import BubbleMenu from './App_bubble';
import { useBubbleMenu } from './context/para/BubbleMenu';

function App() {
  const init = useAreas((state) => state.init);
  const initNotes = useNotes((state) => state.init);
  const close  = useBubbleMenu(state=>state.close)
  useEffect(() => {
    init();
    initNotes();
  }, []);


  return (
    <>
      <BubbleMenu />
      <div onClick={close}>
        <Outlet />
        <Navbar />
        <Aside />
        <Dialog />
      </div>
    </>
  );
}

export default App;
