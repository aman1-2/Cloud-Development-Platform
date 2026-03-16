import { create } from 'zustand';

export const usePortStore = create((set) => {
    return {
        port: null,

        setPort: (incomingPort) => {
            set({
                port: incomingPort
            });
        }
    }
});