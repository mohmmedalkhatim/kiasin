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
import { useLayoutDialog } from './context/para/Dialog';
import { useAside } from './context/aside';

function App() {
  const init = useAreas((state) => state.init);
  const initNotes = useNotes((state) => state.init);
  const close_bubble  = useBubbleMenu(state=>state.close)
  const close_dialog = useLayoutDialog(state=>state.close)
  const close_aside = useAside(state=>state.close)
  const close = ()=>{
    close_bubble()
  }
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
      </div>
        <Aside />
        <Dialog />
    </>
  );
}

export default App;
