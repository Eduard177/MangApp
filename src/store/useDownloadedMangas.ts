import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'downloaded_mangas';

type DownloadedManga = {
  mangaId: string;
  chapters: string[]; // chapterId list
};

interface DownloadedMangasStore {
  downloaded: DownloadedManga[];
  loadDownloaded: () => Promise<void>;
  isChapterDownloaded: (chapterId: string) => boolean;
  addDownloadedChapter: (mangaId: string, chapterId: string) => Promise<void>;
}

export const useDownloadedMangas = create<DownloadedMangasStore>((set, get) => ({
  downloaded: [],

  loadDownloaded: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    set({ downloaded: parsed });
  },

  isChapterDownloaded: (chapterId: string) => {
    return get().downloaded.some((m) => m.chapters.includes(chapterId));
  },

  addDownloadedChapter: async (mangaId: string, chapterId: string) => {
    const current = get().downloaded;
    const found = current.find((m) => m.mangaId === mangaId);

    let updated;
    if (found) {
      if (found.chapters.includes(chapterId)) return;
      found.chapters.push(chapterId);
      updated = [...current];
    } else {
      updated = [...current, { mangaId, chapters: [chapterId] }];
    }

    set({ downloaded: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
