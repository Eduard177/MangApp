import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContinueReadingStore } from '../store/useContinueReadingStore';
import { getChapterNumber } from './mangadexApi';

const CONTINUE_READING_KEY = 'continue_reading';

export const saveMangaToContinueReading = async (
  manga: any,
  lastReadChapterId: string,
  page: number = 0
) => {
  if (!manga?.id || !lastReadChapterId) {
    console.warn('Datos inválidos para guardar en continue_reading');
    return;
  }

  const chapterData = await getChapterNumber(lastReadChapterId);
  const chapterNumber = chapterData?.data?.attributes?.chapter ?? "N/A";
  const cover = manga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName ?? null;
  const title = manga.attributes?.title?.en ??
      manga.attributes?.altTitles?.find((t: any) => t.en)?.en ??
      'Sin título';

  const entry = {
    mangaId: manga.id,
    title,
    cover,
    lastReadChapterId,
    page,              // ✅ GUARDAR PÁGINA
    timestamp: Date.now(),
    chapter: chapterNumber
  };

  try {
    const existing = await AsyncStorage.getItem(CONTINUE_READING_KEY);
    let history = existing ? JSON.parse(existing) : [];

    // Remueve duplicados
    history = history.filter((e: any) => e.mangaId !== manga.id);

    // Agrega al inicio
    history.unshift(entry);

    history = history.slice(0, 100);
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

export const getLastContinueReading = async (limit: number = 15) => {
  try {
    const existing = await AsyncStorage.getItem(CONTINUE_READING_KEY);
    const history = existing ? JSON.parse(existing) : [];
    return history.slice(0, limit);
  } catch (e) {
    console.error('Error loading continue reading list:', e);
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
