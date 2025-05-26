import { FlatList, View } from 'react-native';
import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import MangaCarousel from '../components/MangaCarousel';
import { fetchPopularMangas, fetchMangaGender } from '../services/mangaService';
import { GENRES } from '../utils/genres/genreConstants';
import MainBar from '../components/MainBar';
import { useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';

type GenreItem = {
  title: string;
  fetchFunction: (limit: number, offset: number, data?: any) => Promise<any>;
  data?: string;
};

const genreList: GenreItem[] = [
  {
    title: 'Popular',
    fetchFunction: (limit: number, offset: number) => fetchPopularMangas(limit, offset),
    data: undefined,
  },
  ...Object.entries(GENRES).map(([key, id]) => ({
    title: formatGenreName(key),
    fetchFunction: (limit: number, offset: number, data?: any) =>
      fetchMangaGender(limit, offset, data),
    data: id,
  })),
];
export default function ExploreScreen() {
  const [reloadFlag, setReloadFlag] = useState(false);
  const filterRef = useRef<Modalize>(null);

  const openFilterModal = () => {
    filterRef.current?.open();
  };
  const route = useRoute();

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => openFilterModal()}
        onReload={() => setReloadFlag((prev) => !prev)}
      />

      <FlatList
        data={genreList}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <MangaCarousel title={item.title} fetchFunction={item.fetchFunction} data={item?.data} />
        )}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />

      <MainBar currentRouteName={route.name}/>
    </View>
  );
}

function formatGenreName(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}
