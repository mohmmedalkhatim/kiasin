import ReactDOM from 'react-dom/client'
import './styles.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import Lenis from 'lenis';
import ScrollTrigger from 'gsap/ScrollTrigger';

import gsap from 'gsap';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 3000);
});
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

let Client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={Client}>
        <RouterProvider router={router} />
  </QueryClientProvider>
)