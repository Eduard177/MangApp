import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContinueReadingStore } from '../store/useContinueReadingStore';

const CONTINUE_READING_KEY = 'continue_reading';

export const saveMangaToContinueReading = async (
  manga: any,
  lastReadChapterId: string,
) => {
  
  if (!manga?.id || !lastReadChapterId) {
    console.warn('Datos inválidos para guardar en continue_reading');
    return;
  }

  const entry = {
    mangaId: manga.id,
    title:
      manga.attributes?.title?.en ??
      manga.attributes?.altTitles?.find((t: any) => t.en)?.en ??
      'Sin título',
    cover:
      manga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes
        ?.fileName ?? null,
    lastReadChapterId,
    timestamp: Date.now(),
    chapter: manga.attributes?.chapter
  };

  try {
    const existing = await AsyncStorage.getItem(CONTINUE_READING_KEY);
    let history = existing ? JSON.parse(existing) : [];

    history = history.filter((e: any) => e.mangaId !== manga.id);

    history.unshift(entry);

    history = history.slice(0, 10);
    await AsyncStorage.setItem(CONTINUE_READING_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving to continue reading:', e);
  }
};


export const getContinueReading = async () => {
  try {
    const json = await AsyncStorage.getItem(CONTINUE_READING_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error reading continue reading history', e);
    return [];
  }
};

export const clearContinueReading = async () => {
  try {
    await AsyncStorage.removeItem(CONTINUE_READING_KEY);
    useContinueReadingStore.getState().toggleReload();
    console.log('Historial de lectura borrado.');
  } catch (e) {
    console.error('Error al borrar el historial de lectura', e);
  }
};
