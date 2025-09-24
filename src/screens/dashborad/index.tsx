import './style.css';
import Layout from '../../Area';
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useAreas } from '../../context/para/areas';
import { useEffect, useState } from 'react';
import Header from '../../Area/components/Area_Header';

function DashBoard () {
  const setActive = useAreas(state => state.update_active_area);
  const editable = useAreas(state => state.editable);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    invoke<Area>('dashboard').then(res => {
      setActive(res);
      setLoading(true);
    });
  }, []);
  if (loading) {
    return (
      <>
        <Header />
        <main className={!editable ? 'content' : 'mt-[5rem] mr-[17rem]'}>
          <Layout />
        </main>
      </>
    );
  }
}
export default DashBoard;
