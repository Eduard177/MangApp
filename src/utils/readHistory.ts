import * as SecureStore from 'expo-secure-store';

const KEY = 'readChapters';

export const markChapterAsRead = async (chapterId: string) => {
  const existing = await SecureStore.getItemAsync(KEY);
  const parsed: string[] = existing ? JSON.parse(existing) : [];

  if (!parsed.includes(chapterId)) {
    parsed.push(chapterId);
    await SecureStore.setItemAsync(KEY, JSON.stringify(parsed));
  }
};

export const hasChapterBeenRead = async (chapterId: string): Promise<boolean> => {
  const existing = await SecureStore.getItemAsync(KEY);
  const parsed: string[] = existing ? JSON.parse(existing) : [];
  return parsed.includes(chapterId);
};

export const getReadChapters = async (): Promise<string[]> => {
  const raw = await SecureStore.getItemAsync(KEY);
  return raw ? JSON.parse(raw) : [];
};