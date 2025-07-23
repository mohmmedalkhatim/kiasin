import gsap from 'gsap';
import Lenis from 'lenis';
import { router } from './router';
import ReactDOM from 'react-dom/client';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles.css';
import { AlteShortCuts } from './shortcuts';
import { useAreas } from './context/para/areas';

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 3000);
});

document.addEventListener("keydown",(e)=>{
  if(e.altKey){
    if(e.key == "e"){
      useAreas.getState().toggleEditable()
    }
  }
})
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);

const Client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={Client}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
