
import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { useEffect } from 'react'
import { useAuth } from './context/User'
import Login from './screens/login'

function App() {
  let email = useAuth((state) =>state.email);
  let auth = useAuth((state) =>state.auth);
  let content = email == '' ? <Login /> : <><Header /><Outlet /><Aside /></>
  useEffect(() => {
    auth()
  }, [])
  return (
    <>
      {content}
    </>
  )
}
export default App