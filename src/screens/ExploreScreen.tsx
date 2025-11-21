import { FlatList, View } from 'react-native';
import { useRef, useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import MangaCarousel from '../components/MangaCarousel';
import { GENRES } from '../utils/genres/genreConstants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';
import { getMangaGenre, getPopularManga } from '../services/mangadexApi';
import { useFilterStore } from '../store/useFilterStore';

export type Filters = {
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
  const { manga, setFilter } = useFilterStore();
  const filterRef = useRef<Modalize>(null);
  const route = useRoute();
  const navigation = useNavigation();

  const openFilterModal = () => {
    filterRef.current?.open();
  };

  const genreList: GenreItem[] = useMemo(
    () => [
      {
        title: 'Popular',
        fetchFunction: (limit, offset, filters) =>
          getPopularManga(limit, offset, filters),
      },
      ...Object.entries(GENRES).map(([key, id]) => ({
        title: formatGenreName(key),
        fetchFunction: (limit, offset, filters, id) =>
          getMangaGenre(limit, offset, filters, id),
        data: id,
      })),
    ],
    [manga.orderBy, manga.direction] // ✅ Dependemos del filtro global
  );

  const handlePageReload = () => {
    setReloadFlag((prev) => !prev);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={openFilterModal}
        onReload={handlePageReload}
      />

      <FlatList
        data={genreList}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <MangaCarousel
            title={item.title}
            fetchFunction={item.fetchFunction}
            data={item?.data}
            filters={manga}
            reloadTrigger={reloadFlag}
          />
        )}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        extraData={reloadFlag}
      />

      <FilterModal
        ref={filterRef}
        filterContext="manga"
        filters={manga}
        setFilters={(newFilters) => setFilter('manga', newFilters)}
        onFilterChange={(newFilters) => {
          setFilter('manga', newFilters);
          setReloadFlag((prev) => !prev);
        }}
      />
    </View>
  );
}

function formatGenreName(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}
