import { Outlet } from "react-router-dom";
import "./App.css";
import WindowControls from "./components/window_controller";
import Navbar from "./components/navbar";
import { useEffect } from "react";

function App() {
  useEffect(() => {
  }, [])
  return (
    <main className="bg-surface min-h-screen">
      <WindowControls title="kiasin" />
      <div className="app_container relative">
        <Outlet />
      </div>
      <Navbar />
    </main>
  );
}

export default App;
