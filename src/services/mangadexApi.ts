// src/services/mangadexApi.ts
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';

const api = axios.create({
  baseURL: BASE_URL,
});

export const searchManga = async (title: string) => {
  const response = await api.get('/manga', {
    params: {
      title,
      limit: 10,
      availableTranslatedLanguage: ['es-la', 'en'],
      order: {
        title: 'asc',
      },
    },
  });
  return response.data;
};

export const getMangaChapters = async (mangaId: string) => {
  const response = await api.get(`/manga/${mangaId}/feed`, {
    params: {
      translatedLanguage: ['es-la', 'en'],
      limit: 100,
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

export const getPopularManga = async (limit = 10, offset = 0) => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit,
        offset,
        'order[followedCount]': 'desc',
        includes: ['cover_art'], // para que venga la portada
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error al obtener mangas:', error);
    throw error;
  }
};

export const getGenderManga = async (genderArr = ['shonen']) => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 10,
        offset: 0,
        'order[followedCount]': 'desc',
        includes: ['cover_art'], // para que venga la portada
        includedTags: ['423e2eae-a7a2-4a8b-ac03-a8351462d71d'],
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error al obtener mangas:', error);
    throw error;
  }
};

export const getChaptersByMangaId = async (mangaId: string, limit = 10, offset = 0) => {
  const response = await axios.get(`https://api.mangadex.org/chapter`, {
    params: {
      manga: mangaId,
      translatedLanguage: ['en', 'es-la'],
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
