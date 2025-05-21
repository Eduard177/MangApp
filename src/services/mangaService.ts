import { getChapterPages, getGenderManga, getPopularManga } from './mangadexApi';

export async function fetchPopularMangas(limit = 5, offset = 0) {
  try {
    const response = await getPopularManga(limit, offset);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular mangas:', error);
    return [];
  }
}

export async function fetchMangaGender(limit = 5, offset = 0, genderArr: string,) {
  try {
    const response = await getGenderManga(limit, offset, genderArr);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapters for manga ${genderArr}:`, error);
    return [];
  }
}
export async function featchGetChapterPages(chapterId: string) {
  try {
    const res = await getChapterPages(chapterId);
    return res;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    return null;
  }
}
