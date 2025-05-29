import * as FileSystem from 'expo-file-system';
import { featchGetChapterPages } from '../services/mangaService';

export const downloadChapter = async (chapterId: string, mangaId: string) => {
  try {
    const res = await featchGetChapterPages(chapterId);
    const { baseUrl, chapter } = res;

    const dir = `${FileSystem.documentDirectory}/${mangaId}/${chapterId}`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

      console.log(`Descargando capítulo ${chapterId} del manga ${mangaId}`);

    for (const fileName of chapter.data) {
      const url = `${baseUrl}/data/${chapter.hash}/${fileName}`;
      const localPath = `${dir}/${fileName}`;
      await FileSystem.downloadAsync(url, localPath);
    }

      console.log(`Capitulo descargado ${chapterId} del manga ${mangaId}`);

    return true;
  } catch (error) {
    console.error('Error downloading chapter:', error);
    return false;
  }
};

export const isChapterDownloaded = async (
  mangaId: string,
  chapterId: string,
  minPageCount: number = 1
): Promise<boolean> => {
  try {
    const chapterPath = `${FileSystem.documentDirectory}/${mangaId}/${chapterId}`;
    const chapterInfo = await FileSystem.getInfoAsync(chapterPath);

    if (!chapterInfo.exists || !chapterInfo.isDirectory) {
      return false;
    }

    const files = await FileSystem.readDirectoryAsync(chapterPath);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    
    return imageFiles.length >= minPageCount;
  } catch (error) {
    console.error('Error checking downloaded chapter:', error);
    return false;
  }
};

export const deleteChapter = async (mangaId: string, chapterId: string) => {
  const dirPath = `${FileSystem.documentDirectory}/${mangaId}/${chapterId}`;
  const dirInfo = await FileSystem.getInfoAsync(dirPath);

  if (dirInfo.exists) {
    await FileSystem.deleteAsync(dirPath, { idempotent: true });
    console.log('Capitulo borrado:', chapterId);
  } else {
    console.log('No existe la carpeta del manga:', dirPath);
  }
};