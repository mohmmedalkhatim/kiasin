import './style.css';
import Layout from '../../Layout';
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useQuery } from '@tanstack/react-query';
import { useActionData } from 'react-router-dom';
import { useAreas } from '../../context/para/areas';

function DashBoard({}: {}) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['area'],
    queryFn: async () => await invoke<Area>('dashboard'),
  });
  if (isLoading) return <main className="content">Loading...</main>;
  if (error) return <main className="content">Error: {error.message}</main>;
  if (data) {
    let setActive = useAreas(state=>state.update_active_area)
    setActive(data)
    return (
      <main className="content">
        <Layout  />
      </main>
    );
  }
}
export default DashBoard;
