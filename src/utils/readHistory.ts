import AsyncStorage from '@react-native-async-storage/async-storage';

const READ_CHAPTERS_KEY = 'readChapters';


export const markChapterAsRead = async (chapterId: string) => {
  try {
    const existing = await AsyncStorage.getItem(READ_CHAPTERS_KEY);
    const parsed: string[] = existing ? JSON.parse(existing) : [];

    if (!parsed.includes(chapterId)) {
      parsed.push(chapterId);
      await AsyncStorage.setItem(READ_CHAPTERS_KEY, JSON.stringify(parsed));
    }
  } catch (error) {
    console.error('Error al marcar capítulo como leído:', error);
  }
};

export const hasChapterBeenRead = async (chapterId: string): Promise<boolean> => {
  try {
    const existing = await AsyncStorage.getItem(READ_CHAPTERS_KEY);
    const parsed: string[] = existing ? JSON.parse(existing) : [];
    return parsed.includes(chapterId);
  } catch (error) {
    console.error('Error al verificar si capítulo fue leído:', error);
    return false;
  }
};

export const getReadChapters = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(READ_CHAPTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error al obtener capítulos leídos:', error);
    return [];
  }
};

export const getReadChaptersForManga = async (mangaId: string, allChapterIds: string[]): Promise<string[]> => {
  try {
    const readChapters = await getReadChapters();
    return allChapterIds.filter((chapterId) => readChapters.includes(chapterId));
  } catch (error) {
    console.warn(`Error al obtener capítulos leídos para el manga ${mangaId}:`, error);
    return [];
  }
};

export const clearReadChapters = async () => {
  try {
    await AsyncStorage.removeItem(READ_CHAPTERS_KEY);
    console.log('Capítulos leídos limpiados.');
  } catch (error) {
    console.error('Error al limpiar capítulos leídos:', error);
  }
};
