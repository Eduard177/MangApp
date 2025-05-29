import Toast from 'react-native-toast-message';
import { downloadChapter } from './downloadChapter';
import * as FileSystem from 'expo-file-system';

export async function downloadManga(
  mangaId: string,
  chapters: any[],
  onChapterDownloaded?: (index: number) => void
) {
  for (let i = 0; i < chapters.length; i++) {
    await downloadChapter(chapters[i].id, mangaId);
    onChapterDownloaded?.(i + 1);
  }

    Toast.show({
      type: 'success',
      text1: '¡Descarga completada!',
      text2: `${chapters.length} capítulos descargados`,
      visibilityTime: 1500,
    });
}

export const isMangaDownloaded = async (mangaId: string, totalChapters: string[]) => {
  try {
    const chaptersDir = `${FileSystem.documentDirectory}/${mangaId}`;
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