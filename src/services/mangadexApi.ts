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
      availableTranslatedLanguage: ['en'],
    },
  });
  return response.data;
};

export const getMangaChapters = async (mangaId: string) => {
  const response = await api.get(`/manga/${mangaId}/feed`, {
    params: {
      translatedLanguage: ['en'],
      order: {
        chapter: 'asc',
      },
      limit: 100,
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
