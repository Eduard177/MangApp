import { downloadChapter } from './downloadChapter';
import * as FileSystem from 'expo-file-system';

export const downloadManga = async (mangaId: string, chapters: any[]) => {
  for (const chapter of chapters) {
    const chapterId = chapter.id;
    const success = await downloadChapter(chapterId, mangaId);
    if (!success) {
      console.warn(`Falló la descarga del capítulo ${chapterId}`);
    }
  }

  console.log('Manga completo descargado');
};


export const isMangaDownloaded = async (mangaId: string, totalChapters: string[]) => {
  try {
    const chaptersDir = `${FileSystem.documentDirectory}${mangaId}`;
    const dirs = await FileSystem.readDirectoryAsync(chaptersDir);

    const downloaded = totalChapters.every((chapterId) => dirs.includes(chapterId));
    return downloaded;
  } catch (err) {
    return false;
  }
};

export const deleteManga = async (mangaId: string) => {
  const dirPath = `${FileSystem.documentDirectory}/${mangaId}`;
  const dirInfo = await FileSystem.getInfoAsync(dirPath);

  if (dirInfo.exists) {
    await FileSystem.deleteAsync(dirPath, { idempotent: true });
    console.log('Manga borrado:', mangaId);
  } else {
    console.log('No existe la carpeta del manga:', dirPath);
  }
};