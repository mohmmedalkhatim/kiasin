import gsap from "gsap"
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Aside from './components/Aside'
import Header from './components/Header'
import './App.css'
import { useLayout } from './context/page_schema'
function App() {
  const lenisRef = useRef<any>(null)
  let init = useLayout(state => state.init)
  init('{"items": [{ "id": "1", "rows": 1, "cols": 1 },{ "id": "2", "rows": 1, "cols": 1 },{ "id": "3", "rows": 1, "cols": 1 },{ "id": "4", "rows": 1, "cols": 1 }]}')

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