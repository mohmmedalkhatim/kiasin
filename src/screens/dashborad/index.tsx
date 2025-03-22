import './style.css'
import Layout from '../../Layout'
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';
import { useQuery } from '@tanstack/react-query';

function DashBoard({ }: {}) {
  let { data, error, isLoading } = useQuery({
    queryKey: ['area'],
    queryFn: async () => await invoke<Area>('dashboard')
  })
  if (isLoading) return <main className='content'>Loading...</main>
  if (error) return <main  className='content'>Error: {error.message}</main>
  if (data) {
    return <main className="content">
      <Layout area={data} />
    </main>
  }
}
export default DashBoard
