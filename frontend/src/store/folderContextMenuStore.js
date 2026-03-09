import { create } from 'zustand';

export const useFolderContextMenuStore = create((set) => ({
    folder: null,
    isOpen: false,
    x: null,
    y: null,
    setIsOpen: (incomingIsOpen) => {
        set({
            isOpen: incomingIsOpen
        });
    },
    setX: (incomingX) => {
        set({
            x: incomingX
        });
    },
    setY: (incomingY) => {
        set({
            y: incomingY
        });
    },
    setFolder: (incomingFolder) => {
        set({
            folder: incomingFolder
        });
    }
}));