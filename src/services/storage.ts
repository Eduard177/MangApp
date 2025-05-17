import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'reading_history';

export const addToReadingHistory = async (item: {
  chapterId: string;
  chapter: string;
  title: string;
  manga: any;
  isExternal: boolean;
  coverUrl?: string;
}) => {
  try {
    // Validación rápida del item
    if (!item.chapterId || !item.manga?.id) {
      console.warn('Intento de guardar item inválido en el historial', item);
      return;
    }

    const json = await AsyncStorage.getItem(KEY);
    let history = json ? JSON.parse(json) : [];

    // Eliminar duplicado por chapterId
    history = history.filter((entry: any) => entry.chapterId !== item.chapterId);

    // Agregar al principio
    history.unshift(item);

    // Limitar a los últimos 10
    history = history.slice(0, 10);

    await AsyncStorage.setItem(KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving reading history:', e);
  }
};

export const getReadingHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error getting reading history', e);
    return [];
  }
};
