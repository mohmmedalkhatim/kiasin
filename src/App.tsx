import { Outlet } from "react-router-dom";
import "./App.css";
import WindowControls from "./components/window_controller";
import Navbar from "./components/navbar";
import { Suspense, useEffect } from "react";

function App() {
  useEffect(() => {
  }, [])
  return (
    <main className="min-h-screen bg-dark-900">
      <WindowControls title="kiasin" />
      <div className="app_container relative">
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-support-500">Loading…</div>}>
          <Outlet />
        </Suspense>
      </div>
      <Navbar />
    </main>
  );
}

export default App;
