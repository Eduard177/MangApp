import { getChapterPages } from './mangadexApi';
export async function featchGetChapterPages(chapterId: string) {
  try {
    const res = await getChapterPages(chapterId);
    return res;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    return null;
  }
}