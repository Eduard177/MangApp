import { View, Text, FlatList, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getChaptersByMangaId } from '../services/mangadexApi';

export default function MangaDetailScreen() {
  const route = useRoute<RouteProp<any>>();
  const { manga } = route.params;

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const data = await getChaptersByMangaId(manga.id);
      setChapters(data.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <ScrollView className="p-4 bg-white dark:bg-black">
      <Text className="text-2xl font-bold mb-2">{manga.attributes.title.en ?? 'Sin título'}</Text>

      <Text className="text-base mb-4 text-gray-700 dark:text-gray-300">
        {manga.attributes.description?.en ?? 'Sin descripción disponible.'}
      </Text>

      <Text className="text-xl font-semibold mb-2">Capítulos:</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('ChapterReader', { chapterId: item.id })}>
              <Text className="text-base py-2 border-b border-gray-200 dark:border-gray-700">
                Capítulo {item.attributes.chapter ?? 'N/A'}: {item.attributes.title ?? ''}
              </Text>
            </Pressable>
          )}
        />
      )}
    </ScrollView>
  );
}
