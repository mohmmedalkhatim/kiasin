import './style.css';
import Layout from '../../Layout';
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useQuery } from '@tanstack/react-query';
import { useAreas } from '../../context/para/areas';
import Header from '../../components/Headers/Area_Header';
import { Store } from 'tauri-plugin-store-api';

function DashBoard ({}: {}) {
  const setActive = useAreas(state => state.update_active_area);
  const editable = useAreas(state=>state.editable);

  const dashboard_store = new Store('./dashboard');

  const { data, error, isLoading } = useQuery({
    queryKey: ['area'],
    queryFn: async () => invoke<Area>("dashboard"),
  });
  if (isLoading) return <main className='content'>Loading...</main>;
  if (error) {
    console.log(error)
    return <main className='content'>Error: {error.message}</main>;
  }
  if (data) {
    setActive(data);
    return (
      <>
        <Header />
        <main className={!editable?"content":"mt-[5rem] mr-[16rem]"}>
          <Layout />
        </main>
      </>
    );
  }
}
export default DashBoard;
