import "./App.css";
import Header from "./components/Header";
import Aside from "./components/Aside";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Aside />
    </>
  );
}

export default App;
