import { getMangaGenre, getPopularManga } from '../services/mangadexApi';

export const fetchFunctionsMap = {
  popular: getPopularManga,
  gender: getMangaGenre,
};
