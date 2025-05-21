// src/services/mangadexApi.ts
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

const api = axios.create({
  baseURL: BASE_URL,
});

export const searchManga = async (
  title: string,
  translatedLanguage: Array<string> = ['en'],
  limit: number = 10,
  offset: number = 0,
) => {
  const response = await api.get('/manga', {
    params: {
      title,
      limit,
      offset,
      availableTranslatedLanguage: translatedLanguage,
      order: {
        followedCount: 'desc',
      },
      includes: ['cover_art'],
    },
  });
  return response.data;
};

export const getMangaChapters = async (
  mangaId: string,
  translatedLanguage: Array<string> = ['en'],
  limit: number = 10,
) => {
  const response = await api.get(`/manga/${mangaId}/feed`, {
    params: {
      translatedLanguage: translatedLanguage,
      limit,
      order: {
        chapter: 'asc',
      },
    },
  });
  return response.data;
};

export const getChapterImages = async (chapterId: string) => {
  const res = await api.get(`/at-home/server/${chapterId}`);
  return res.data;
};

export const getPopularManga = async (limit = 5, offset = 0) => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit,
        offset,
        'order[followedCount]': 'desc',
        includes: ['cover_art'],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error al obtener mangas:', error);
    throw error;
  }
};

export const getGenderManga = async (limit = 5, offset = 0, genderArr = '') => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit,
        offset,
        'order[rating]': 'desc',
        includes: ['cover_art'],
        includedTags: [genderArr],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error al obtener mangas:', error);
    throw error;
  }
};

export const getAllTags = async () => {
  try {
    const res = await axios.get('https://api.mangadex.org/manga/tag');
    return res.data.data; // Lista de etiquetas
  } catch (error) {
    console.error('Error al obtener las etiquetas:', error);
    throw error;
  }
};

export const getChaptersByMangaId = async (
  mangaId: string,
  limit = 10,
  offset = 0,
  translatedLanguage: Array<string> = ['en'],
) => {
  const response = await axios.get(`https://api.mangadex.org/chapter`, {
    params: {
      manga: mangaId,
      translatedLanguage: translatedLanguage,
      order: {
        chapter: 'asc',
      },
      limit,
      offset,
    },
  });

  return response.data;
};

export const getChapterPages = async (chapterId: string) => {
  const response = await fetch(
    `https://api.mangadex.org/at-home/server/${chapterId}?forcePort443=true`,
  );
  const data = await response.json();
  return data;
};

export const getChapterPagesExternal = async (chapterId: string) => {
  const response = await fetch(`https://api.mangadex.org/chapter/${chapterId}`);
  const data = await response.json();

  return data;
};

export const fetchMangaById = async (mangaId: string) => {
  const res = await axios.get(`https://api.mangadex.org/manga/${mangaId}`, {
    params: { includes: ['cover_art'] },
  });
  return res.data.data;
};
