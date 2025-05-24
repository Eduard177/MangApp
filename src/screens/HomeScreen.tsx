import { FlatList, View } from 'react-native';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import MangaCarousel from '../components/MangaCarousel';
import { fetchPopularMangas, fetchMangaGender } from '../services/mangaService';
import { GENRES } from '../utils/genres/genreConstants';
import MainBar from '../components/MainBar';

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
export default function HomeScreen() {
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => console.log('Filter pressed')}
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
      <MainBar />
    </View>
  );
}

function formatGenreName(name: string) {
  return name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}
