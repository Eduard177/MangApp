
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'continue_reading';

export const saveMangaToContinueReading = async (manga: any, lastReadChapterId: string) => {
  const newEntry = {
    id: manga.id,
    title: manga.attributes.title?.en ?? 'Sin título',
    cover: manga.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName,
    lastReadChapterId,
    timestamp: Date.now(),
  };

  try {
    const existing = await AsyncStorage.getItem(KEY);
    let history = existing ? JSON.parse(existing) : [];

    history = history.filter((entry: any) => entry.id !== manga.id);

    history.unshift(newEntry);
    history = history.slice(0, 10);

    await AsyncStorage.setItem(KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving to continue reading', e);
  }
};
