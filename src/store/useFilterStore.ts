import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeFilters = {
  onlyDownloaded: boolean;
  unread: boolean;
  completed: boolean;
  started: boolean;
};

type MangaFilters = {
  orderBy: 'rating' | 'followedCount' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

type FilterState = {
  home: HomeFilters;
  manga: MangaFilters;
  numColumns: number;
  setNumColumns: (cols: number) => void;
  setFilter: <T extends keyof Omit<FilterState, 'setFilter' | 'resetFilters' | 'setNumColumns'>>(
    context: T,
    newFilters: Partial<FilterState[T]>
  ) => void;
  resetFilters: <T extends keyof Omit<FilterState, 'setFilter' | 'resetFilters' | 'setNumColumns'>>(context: T) => void;
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      home: {
        onlyDownloaded: false,
        unread: false,
        completed: false,
        started: false,
      },
      manga: {
        orderBy: 'rating',
        direction: 'desc',
      },
      numColumns: 3,
      setNumColumns: (cols) => set({ numColumns: cols }),
      setFilter: (context, newFilters) =>
        set((state) => ({
          [context]: {
            ...state[context],
            ...newFilters,
          },
        })),
      resetFilters: (context) =>
        set((state) => ({
          [context]:
            context === 'home'
              ? { onlyDownloaded: false, unread: false, completed: false, started: false }
              : { orderBy: 'rating', direction: 'desc' },
        })),
    }),
    {
      name: 'filter-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
