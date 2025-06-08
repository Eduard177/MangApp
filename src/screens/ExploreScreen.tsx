import { FlatList, View } from 'react-native';
import { useRef, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import MangaCarousel from '../components/MangaCarousel';
import { GENRES } from '../utils/genres/genreConstants';
import MainBar from '../components/MainBar';
import { useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';
import { isMangaDownloaded } from '../utils/downloadManga';
import { getMangaGenre, getPopularManga } from '../services/mangadexApi';
type Filters = {
  onlyDownloaded?: boolean;
  unread?: boolean;
  completed?: boolean;
  started?: boolean;
  orderBy?: 'rating' | 'followedCount' | 'createdAt' | 'updatedAt';
  direction?: 'asc' | 'desc';
};

type GenreItem = {
  title: string;
  fetchFunction: (
    offset: number,
    limit: number,
    filters?: Filters,
    genderId?: string
  ) => Promise<any[]>;
  data?: string;
};

export default function ExploreScreen() {
  const [reloadFlag, setReloadFlag] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    orderBy: 'rating',
    direction: 'desc',
  });

  const filterRef = useRef<Modalize>(null);
  const route = useRoute();

  const openFilterModal = () => {
    filterRef.current?.open();
  };

  const genreList: GenreItem[] = useMemo(
    () => [
      {
        title: 'Popular',
        fetchFunction: (limit,offset, filters) =>
          getPopularManga(limit, offset, filters),
      },
      ...Object.entries(GENRES).map(([key, id]) => ({
        title: formatGenreName(key),
        fetchFunction: (limit,offset, filters, id) =>
          getMangaGenre(limit, offset, filters, id),
        data: id,
      })),
    ],
    [filters.orderBy, filters.direction]
  );


  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={openFilterModal}
        onReload={() => setReloadFlag((prev) => !prev)}
      />

      <FlatList
        data={genreList}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <MangaCarousel
            title={item.title}
            fetchFunction={item.fetchFunction}
            data={item?.data}
            filters={filters}
          />
        )}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        extraData={reloadFlag}
      />

      <MainBar currentRouteName={route.name} />

      <FilterModal
        ref={filterRef}
        filterContext="explore"
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({ ...prev, ...newFilters }));
          setReloadFlag((prev) => !prev); // fuerza recarga
        }}
      />
    </View>
  );
}

function formatGenreName(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

async function applyFilters(mangaList: any[], filters?: Filters) {
  if (!filters) return mangaList;

  let result = [...mangaList];

  if (filters.onlyDownloaded) {
    result = await filterByDownloaded(result);
  }

  // Otros filtros como unread, completed, started puedes agregarlos aquí si tienes los métodos
  return result;
}

async function filterByDownloaded(mangas: any[]) {
  const filtered = await Promise.all(
    mangas.map(async (manga) => {
      const totalChapters = manga?.attributes?.lastChapterNumberList ?? []; // asegúrate de tener esta info
      const downloaded = await isMangaDownloaded(manga.id, totalChapters);
      return downloaded ? manga : null;
    })
  );
  return filtered.filter(Boolean);
}
