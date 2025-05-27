// utils/offlineUtils.ts
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAPTER_CACHE_KEY = 'offline_chapters';

export const saveChapterOffline = async (chapterId: string, images: string[]) => {
  const localUris: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const filename = `${chapterId}_${i}.jpg`;
    const localPath = `${FileSystem.documentDirectory}chapters/${filename}`;

    try {
      const res = await FileSystem.downloadAsync(url, localPath);
      localUris.push(res.uri);
    } catch (error) {
      console.warn(`Error downloading ${url}`, error);
    }
  }

  const existing = await AsyncStorage.getItem(CHAPTER_CACHE_KEY);
  const parsed = existing ? JSON.parse(existing) : {};

  parsed[chapterId] = localUris;
  await AsyncStorage.setItem(CHAPTER_CACHE_KEY, JSON.stringify(parsed));
};

export const getOfflineChapter = async (chapterId: string): Promise<string[] | null> => {
  const raw = await AsyncStorage.getItem(CHAPTER_CACHE_KEY);
  const data = raw ? JSON.parse(raw) : {};
  return data[chapterId] ?? null;
};
