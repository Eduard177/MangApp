import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { getChaptersByMangaId } from '../services/mangadexApi';

type RootStackParamList = {
  MangaDetails: { manga: any };
  ChapterReader: { chapterId: string };
};

export default function MangaDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'MangaDetails'>>();
  const { manga } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [chapters, setChapters] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const limit = 20;

  const fetchChapters = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getChaptersByMangaId(manga.id, limit, offset);
      const newChapters = response.data ?? [];

      // Evita duplicados por ID
      setChapters((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const filtered = newChapters.filter((c) => !existingIds.has(c.id));
        return [...prev, ...filtered];
      });

      setOffset((prev) => prev + limit);
      setHasMore(newChapters.length === limit);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
      setInitialLoadDone(true);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const renderChapter = ({ item }: { item: any }) => (
    <Pressable onPress={() => navigation.navigate('ChapterReader', { chapterId: item.id })}>
      <Text className="text-base py-2 border-b border-gray-200 dark:border-gray-700">
        Capítulo {item.attributes.chapter ?? 'N/A'}: {item.attributes.title ?? ''}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      className="bg-white dark:bg-black p-4"
      data={chapters}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderChapter}
      onEndReached={fetchChapters}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <View>
          <Text className="text-2xl font-bold mb-2">
            {manga.attributes.title.en ?? 'Sin título'}
          </Text>
          <Text className="text-base mb-4 text-gray-700 dark:text-gray-300">
            {manga.attributes.description?.en ?? 'Sin descripción disponible.'}
          </Text>
          <Text className="text-xl font-semibold mb-2">Capítulos:</Text>
          {initialLoadDone && chapters.length === 0 && (
            <Text className="text-base text-gray-500 dark:text-gray-400 italic">
              No hay capítulos disponibles para este manga.
            </Text>
          )}
        </View>
      }
      ListFooterComponent={loading ? <ActivityIndicator size="small" className="my-4" /> : null}
    />
  );
}
