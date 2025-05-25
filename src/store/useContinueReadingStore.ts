import { create } from 'zustand';

interface ContinueReadingStore {
  reloadFlag: boolean;
  toggleReload: () => void;
}

export const useContinueReadingStore = create<ContinueReadingStore>((set) => ({
  reloadFlag: false,
  toggleReload: () => set((state) => ({ reloadFlag: !state.reloadFlag })),
}));
