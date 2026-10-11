import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./contexts/store";
import gsap from 'gsap';
import Lenis from 'lenis';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { load, Store } from '@tauri-apps/plugin-store';
import Database from '@tauri-apps/plugin-sql';


export let storage: Store;

export let DB: Database;

let container = document.getElementById("root") as HTMLElement

(async () => {
  storage = await load("main.json")
  let root = ReactDOM.createRoot(container)
    root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  );
})()

const lenis = new Lenis({});



lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 3000);
});


gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

