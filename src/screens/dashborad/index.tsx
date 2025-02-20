import './style.css'
import Borad from '../../components/board'
import { invoke } from '@tauri-apps/api/core';
import { useLayout } from '../../context/page_schema';
import { useEffect, useMemo } from 'react';
import { Area } from '../../types/area';

function Dashborad() {
  let element: Area = {
    title: '',
    discription: '',
    ui_schema: {item:[]},
    cover: '',
    icon: ""
  };
  let { init } = useLayout()

  useEffect(() => {
    invoke<Area>("dashboard").then(res => {
      console.log(res.ui_schema)
      init(res.ui_schema)
    }).catch((e) => {
      console.log(e)
    })
  }, [])
  return (
    <main className='content flex flex-col'>
      <Borad  />
    </main>
  )
}
export default Dashborad
