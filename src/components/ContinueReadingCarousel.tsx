import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { clearContinueReading, getLastContinueReading } from '../services/storage';
import { useContinueReadingStore } from '../store/useContinueReadingStore';
import { Ionicons } from '@expo/vector-icons';

export default function ContinueReadingCarousel() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const { reloadFlag } = useContinueReadingStore();
  useEffect(() => {
    const load = async () => {
      const data = await getLastContinueReading();
      setHistory(data);
    };
    load();
  }, [reloadFlag]);

  const getCoverUrl = (item: any) => {
    const fileName = item?.cover;
    return fileName ? `https://uploads.mangadex.org/covers/${item.mangaId}/${item.cover}.256.jpg` : null;
  };

  if (!history.length) return null;

  return (
    <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold dark:text-white">Continue Reading</Text>
          <Pressable onPress={() => navigation.navigate('ContinueReadingList')}>
            <Ionicons name="arrow-forward" size={26} color="#ec4899" />
          </Pressable>
        </View>
      <FlatList
        data={history}
        horizontal
        keyExtractor={(item, index) => `${item.lastReadChapterId}-${index}`}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            className="mr-4"
            onPress={() =>
              navigation.navigate('ChapterReader', {
                chapterId: item.lastReadChapterId,
                mangaId: item.mangaId,
                page: item.page ?? 0,
              })
            }
          >
            <Image
              source={{ uri: getCoverUrl(item) }}
              style={{ width: 120, height: 180, borderRadius: 8 }}
            />
            <Text className="mt-1 w-28 text-sm font-medium text-left dark:text-white" numberOfLines={1}>
              {item.title ?? 'Sin título'}
            </Text>
            <Text className="text-xs text-pink-500">
              Capítulo {item.chapter} {item.page != null ? `(Page ${item.page + 1})` : ''}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
