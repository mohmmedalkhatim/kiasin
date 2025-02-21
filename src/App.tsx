
import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { usePara } from './context/para'
import { useEffect } from 'react'

function App() {
  let init = usePara((state)=>state.init) 
  useEffect(()=>{
    init()
  },[])
  return (
    <>
      <Header />
      <Outlet />
      <Aside />
    </>
  )
}
export default App