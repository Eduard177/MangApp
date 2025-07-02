import { create } from 'zustand';

export type ReaderMode = 'vertical' | 'horizontal-rtl' | 'horizontal-ltr';

interface ReaderModeState {
  mode: ReaderMode;
  setMode: (mode: ReaderMode) => void;
}

export const useReaderModeStore = create<ReaderModeState>((set) => ({
  mode: 'vertical',
  setMode: (mode) => set({ mode }),
}));
