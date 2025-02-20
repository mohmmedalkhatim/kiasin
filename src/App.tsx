import gsap from "gsap"
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
function App() {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <>
      <Header />
      <ReactLenis options={{ autoRaf: false }} ref={lenisRef}>
        <Outlet />
      </ReactLenis>
      <Aside />
    </>
  )
}
export default App