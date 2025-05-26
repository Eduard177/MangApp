import { create } from 'zustand';

interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
  refreshFlag: boolean;
  toggleRefresh: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang, refreshFlag: true }),
  refreshFlag: false,
  toggleRefresh: () => set((state) => ({ refreshFlag: !state.refreshFlag })),
}));
