import axios from 'axios';
import { getApiLanguage } from '../utils/getApiLang';

const BASE_URL = 'https://api.mangadex.dev';
const api = axios.create({
  baseURL: BASE_URL,
});

type Filters = {
  orderBy?: 'rating' | 'followedCount' | 'createdAt' | 'updatedAt';
  direction?: 'asc' | 'desc';
};

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

export const getMangaAllChapters = async (
  mangaId: string,
) => {
  const lang = await getApiLanguage();
  const response = await api.get(`/manga/${mangaId}/feed`, {
    params: {
      translatedLanguage: [lang],
      order: {
        chapter: 'asc',
      },
    },
  });
  return response.data?.data;
};

export const getChapterImages = async (chapterId: string) => {
  const res = await api.get(`/at-home/server/${chapterId}`);
  return res.data;
};

export const getPopularManga = async (
  limit = 8,
  offset = 0,
  filters: Filters = {}
) => {
  try {
    const lang = await getApiLanguage();
    const { orderBy = 'rating', direction = 'desc' } = filters;

    const res = await api.get('/manga', {
      params: {
        limit,
        offset,
        availableTranslatedLanguage: [lang],
        [`order[${orderBy}]`]: direction,
        includes: ['cover_art'],
      },
    });

    return res.data?.data ?? [];
  } catch (error) {
    console.error('Error al obtener mangas populares:', error);
    throw error;
  }
};

export const getMangaGenre = async (
  limit = 8,
  offset = 0,
  filters: Filters = {},
  genreId: string,
) => {
  try {
    const lang = await getApiLanguage();
    const { orderBy = 'rating', direction = 'desc' } = filters;

    const res = await api.get('/manga', {
      params: {
        limit,
        offset,
        includedTags: [genreId],
        availableTranslatedLanguage: [lang],
        [`order[${orderBy}]`]: direction,
        includes: ['cover_art'],
      },
    });

    return res.data?.data ?? [];
  } catch (error) {
    console.error('Error al obtener mangas por género:', error);
    throw error;
  }
};

export const getFilteredManga = async ({
  limit = 10,
  offset = 0,
  tag = '',
  orderBy = 'rating',
  direction = 'desc',
}: {
  limit?: number;
  offset?: number;
  tag?: string;
  orderBy?: 'rating' | 'followedCount' | 'createdAt' | 'updatedAt' | 'year';
  direction?: 'asc' | 'desc';
}) => {
  try {
    const lang = await getApiLanguage();
    const params: any = {
      limit,
      offset,
      availableTranslatedLanguage: [lang],
      includes: ['cover_art'],
      [`order[${orderBy}]`]: direction,
    };

    if (tag) {
      params.includedTags = [tag];
    }

    const res = await api.get(`/manga`, { params });
    return res.data;
  } catch (error) {
    console.error('Error al filtrar mangas:', error);
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

export const getChapterNumber = async (chapterId: string) => {
  const lang = await getApiLanguage();
  const response = await api.get(`/chapter/${chapterId}`, {
    params: {
      translatedLanguage: [lang],
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