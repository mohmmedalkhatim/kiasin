import { create } from "zustand";



interface search_context {
    opened: boolean;
    open: () => void;
    close: () => void;
    results: [];
    find: (text: string) => void
}

export let useSearch = create<search_context>(set => ({
    opened: false,
    results: [],
    open: () => { set({ opened: true }) },
    close: () => { set({ opened: false }) },
    find: (text) => {
        
    }
}));
