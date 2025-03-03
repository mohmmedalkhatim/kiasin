import './style.css'
import Borad from '../../components/board'
import { useLayout } from '../../context/page_schema';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Area } from '../../types/area';

function Dashborad({ }: {}) {
  let { init } = useLayout();
    useEffect(() =>{ 
      invoke<Area>("dashboard").then(res=>{
        init(res.ui_schema)
      });
    }, [])
    return (
      <main className='content flex flex-col'>
        <Borad />
      </main>
    )
  }
export default Dashborad
