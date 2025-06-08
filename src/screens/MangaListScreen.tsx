import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCoverUrl } from '../components/MangaCarousel'; // reutiliza tu función
import Navbar from '../components/Navbar';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';

const LIMIT = 20;

export default function MangaListScreen() {
  const route = useRoute();
  const { title, fetchFunction, data } = route.params as any;

  const [mangas, setMangas] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);

  const filterRef = useRef<Modalize>(null);
  
  const navigation = useNavigation();
  const openFilterModal = () => {
    filterRef.current?.open();
  };
  const loadMore = async () => {
    if (!fetchFunction || loading || !hasMore) return;
    setLoading(true);
    try {
      const newData = await fetchFunction(LIMIT, offset, data);
      const filtered = newData.filter((item: any) => !mangas.find((m) => m.id === item.id));
      const updated = [...mangas, ...filtered];
      setMangas(updated);
      setOffset((prev) => prev + LIMIT);
      if (filtered.length < LIMIT) setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <View className='flex-1'>
      <Navbar
        onFilter={() => openFilterModal()}
        onReload={() => setReloadFlag((prev) => !prev)}
      />
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4 dark:text-white">{title}</Text>
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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
      <FilterModal ref={filterRef} filterContext={'mangaList'}/>

    </View>
    </View>

  );
}
