import gsap from 'gsap';
import Lenis from 'lenis';
import { router } from './router';
import ReactDOM from 'react-dom/client';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { RouterProvider } from 'react-router-dom';
import './styles.css';
import { initShortcuts } from './shortcuts';
import { load } from '@tauri-apps/plugin-store';
import React from 'react';
import Database from '@tauri-apps/plugin-sql';

export let DB: Database;

(async () => {
  DB =  await Database.load(`sqlite:Database/test.db`);
})()

const lenis = new Lenis();

export const storage = load("event.json");


lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 3000);
});

initShortcuts()

gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
