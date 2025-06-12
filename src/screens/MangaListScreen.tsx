import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCoverUrl } from '../components/MangaCarousel';
import Navbar from '../components/Navbar';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';
import { getMangaGenre, getPopularManga } from '../services/mangadexApi';
import MangaListSkeleton from '../components/loading/MangaListSkeleton';
import { useFilterStore } from '../store/useFilterStore';

const LIMIT = 20;

export default function MangaListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { title, data } = route.params as any;

  const [mangas, setMangas] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);

  const { manga, setFilter } = useFilterStore(); // ✅ usamos el filtro global
  const filterRef = useRef<Modalize>(null);

  const openFilterModal = () => {
    filterRef.current?.open();
  };

  const loadMore = async (replace = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const fetchFunction = title === 'popular' ? getPopularManga : getMangaGenre;
      const currentOffset = replace ? 0 : offset;

      const newData = await fetchFunction(LIMIT, currentOffset, manga, data ?? null); // ✅ usamos filtro global
      const filtered = newData.filter((item: any) =>
        replace ? true : !mangas.find((m) => m.id === item.id)
      );

      const updated = replace ? filtered : [...mangas, ...filtered];
      setMangas(updated);
      setOffset((prev) => (replace ? LIMIT : prev + LIMIT));
      setHasMore(filtered.length >= LIMIT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore(true);
  }, [manga]); // ✅ recarga al cambiar filtro global

  return (
    <View className='flex-1'>
      <Navbar
        onFilter={openFilterModal}
        onReload={() => setReloadFlag((prev) => !prev)}
      />
      <View className="flex-1 bg-white dark:bg-gray-900 p-4 pr-1">
        <Text className="text-2xl font-bold mb-4 dark:text-white">{title}</Text>

        {loading && mangas.length === 0 ? (
          <MangaListSkeleton />
        ) : (
          <FlatList
            data={mangas}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigation.navigate('MangaDetails', { manga: item })}
                className="mb-4 flex-row"
              >
                <Image
                  source={{ uri: getCoverUrl(item) }}
                  style={{ width: 100, height: 150, borderRadius: 8, marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className="text-base font-bold dark:text-white">
                    {item.attributes?.title?.en ?? 'Sin título'}
                  </Text>
                  <Text className="text-sm text-gray-400">
                    {item.attributes?.tags?.map((t: any) => t.attributes?.name?.en).join(' • ')}
                  </Text>
                </View>
              </Pressable>
            )}
            onEndReached={() => loadMore()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && mangas.length > 0 ? <ActivityIndicator /> : null}
          />
        )}

        <FilterModal
          ref={filterRef}
          filterContext={'manga'}
          filters={manga}
          setFilters={(newFilters) => setFilter('manga', newFilters)}
          onFilterChange={(newFilters) => {
            setFilter('manga', newFilters);
            setReloadFlag((prev) => !prev);
          }}
        />
      </View>
    </View>
  );
}
