import * as FileSystem from 'expo-file-system';
import { featchGetChapterPages } from '../services/mangaService';

export const downloadChapter = async (chapterId: string, mangaId: string) => {
  try {
    const res = await featchGetChapterPages(chapterId);
    const { baseUrl, chapter } = res;

    const dir = `${FileSystem.documentDirectory}${mangaId}/${chapterId}`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    for (const fileName of chapter.data) {
      const url = `${baseUrl}/data/${chapter.hash}/${fileName}`;
      const localPath = `${dir}/${fileName}`;
      await FileSystem.downloadAsync(url, localPath);
    }

    return true;
  } catch (error) {
    console.error('Error downloading chapter:', error);
    return false;
  }
};
