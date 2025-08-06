import { create } from "zustand";


interface BubbleMenu {
    opened: Boolean,
    toggle: () => void,
    open: () => void,
    close: () => void,
}


export let useBubbleMenu = create<BubbleMenu>(set => ({
    opened: false,
    toggle: () => set(({ opened }) => ({ opened: !opened })),
    open:()=> set({opened:true}),
    close:()=> set({opened:false})
}))