
import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { usePara } from './context/para'
import { useEffect } from 'react'
import { useAuth } from './context/User'
import Login from './screens/login'

function App() {
  let init = usePara((state) => state.init);
  let email = useAuth((state) => state.email);
  let content = email == '' ? <Login /> : <><Header /><Outlet /><Aside /></>
  useEffect(() => {
    init()
  }, [])
  return (
    <>
      {content}
    </>
  )
}
export default App