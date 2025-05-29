import axios from 'axios';
import { getApiLanguage } from '../utils/getApiLang';

const BASE_URL = 'https://api.mangadex.org';
const api = axios.create({
  baseURL: BASE_URL,
});

export const searchManga = async (
  title: string,
  limit: number = 10,
  offset: number = 0,
) => {
  const lang = await getApiLanguage();
  const response = await api.get('/manga', {
    params: {
      title,
      limit,
      offset,
      availableTranslatedLanguage: [lang],
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
  limit: number = 10,
) => {
  const lang = await getApiLanguage();
  const response = await api.get(`/manga/${mangaId}/feed`, {
    params: {
      translatedLanguage: [lang],
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
    const lang = await getApiLanguage();
    const res = await api.get(`/manga`, {
      params: {
        limit,
        offset,
        availableTranslatedLanguage: [lang],
        'order[rating]': 'desc',
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
    const lang = await getApiLanguage();
    const res = await api.get(`/manga`, {
      params: {
        limit,
        offset,
        availableTranslatedLanguage: [lang],
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
    const res = await api.get('/manga/tag');
    return res.data.data; // Lista de etiquetas
  } catch (error) {
    console.error('Error al obtener las etiquetas:', error);
    throw error;
  }
};

export const getAuthorManga = async (authorId: string) => {
  try {
    const res = await api.get(`/author/${authorId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error al obtener mangas del autor:', error);
    throw error;
  }
};

export const getChaptersByMangaId = async (
  mangaId: string,
  limit = 10,
  offset = 0,
  order: 'asc' | 'desc' = 'asc',
) => {
  const lang = await getApiLanguage();
  const response = await api.get(`/chapter`, {
    params: {
      manga: mangaId,
      translatedLanguage: [lang],
      order: {
        chapter: order,
      },
      limit,
      offset,
    },
  });

  return response.data;
};

export const getChapterPages = async (chapterId: string) => {
  try {
    const response = await api.get(`/at-home/server/${chapterId}?forcePort443=true`);

    return response.data;
  } catch (error) {
    console.error('Error al obtener las páginas del capítulo:', error);
    throw error;
  }
};

export const getChapterPagesExternal = async (chapterId: string) => {
  try {
    const response = await api.get(`/at-home/server/${chapterId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las páginas del capítulo:', error);
    throw error;
  }
};

export const fetchMangaById = async (mangaId: string) => {
  try {
    const res = await api.get(`/manga/${mangaId}`, {
      params: { includes: ['cover_art'] },
    });
    return res.data.data;
  } catch (error) {
    console.error('Error al obtener el manga por ID:', error);
    throw error;
  }
};

export const fetchAllChapters = async (mangaId: string) => {
  let allChapters: any[] = [];
  let offset = 0;
  const limit = 100;
  const lang = await getApiLanguage();

  while (true) {
    const res = await api.get('/chapter', {
      params: {
        limit,
        offset,
        manga: mangaId,
        translatedLanguage:[lang]
      }
    })
    if (!res?.data?.data?.length) break;
    allChapters = allChapters.concat(res.data.data);
    offset += limit;
  }

  return allChapters;
};