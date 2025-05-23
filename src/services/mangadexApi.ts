// src/services/mangadexApi.ts
import axios from 'axios';

const BASE_URL = 'https://api.mangadex.dev';

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
    const res = await api.get(`/manga`, {
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
    const res = await api.get(`/manga`, {
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
    console.log(error)
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
    const res = await api.get(`/author/${authorId}`, );
    return res.data.data;
  } catch (error) {
    console.log(error)
    console.error('Error al obtener mangas del autor:', error);
    throw error;
  }
};

export const getChaptersByMangaId = async (
  mangaId: string,
  limit = 10,
  offset = 0,
  translatedLanguage: Array<string> = ['en'],
) => {
  const response = await api.get(`/chapter`, {
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
  try{
  const response = await api.get(`/at-home/server/${chapterId}?forcePort443=true`)

  return response.data;
  }catch (error) {
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
