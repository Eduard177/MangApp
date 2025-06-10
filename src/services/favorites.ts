import AsyncStorage from '@react-native-async-storage/async-storage';
import cloneDeep from 'lodash.clonedeep';
const FAVORITES_KEY = 'saved_manga';

export const getSavedMangas = async () => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error reading saved mangas:', e);
    return [];
  }
};

export const isMangaSaved = async (mangaId: string) => {
  const saved = await getSavedMangas();
  return saved.some((item: any) => item.manga.id === mangaId);
};

export const saveManga = async (manga: any) => {
  const saved = await getSavedMangas();
  const exists = saved.some((item: any) => item.manga?.id === manga.id);

  if (!exists) {
    const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
    const cover = coverArt?.attributes?.fileName ?? '';

    const formatted = {
      manga: JSON.parse(JSON.stringify(manga)),
      title: manga?.attributes?.title?.en ?? 'Untitled',
      cover,
    };

    const updated = [formatted, ...saved].slice(0, 20); // máx. 20 guardados
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
};
export const removeManga = async (mangaId: string) => {
  const saved = await getSavedMangas();
  const updated = saved.filter((item: any) => item.manga.id !== mangaId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};
