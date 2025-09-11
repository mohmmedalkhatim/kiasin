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
import { useDatabase } from './context/para/database';
import { useEvents } from './context/para/events';
import Toolsbar from './components/tools';
import WindowsControl from './components/Controller';


function App() {
  const init = useAreas((state) => state.init);
  const init_db = useDatabase(state=>state.init)
  const initNotes = useNotes((state) => state.init);
  const initEvent = useEvents((state) => state.init);
  const close_bubble = useBubbleMenu(state => state.close)
  const close = async () => {
    close_bubble()
  }
  useEffect(() => {
    init_db()
    init();
    initNotes();
    initEvent()
  }, []);


  return (
    <>
      <BubbleMenu />
      <WindowsControl />
      <div className='' onClick={close}>
        <Outlet />
        <Navbar />
        <Toolsbar/>
      </div>
      <Aside />
      <Dialog />
    </>
  );
}

export default App;
