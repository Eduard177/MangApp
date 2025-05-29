import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { clearContinueReading, getContinueReading } from '../services/storage';
import { useContinueReadingStore } from '../store/useContinueReadingStore';


export default function ContinueReadingCarousel() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const { reloadFlag } = useContinueReadingStore();

  useEffect(() => {
    const load = async () => {
      const data = await getContinueReading();
      setHistory(data);
    };
    load();
  }, [reloadFlag]);

  const getCoverUrl = (item: any) => {
    const fileName = item?.cover;
    return fileName ? `https://uploads.mangadex.org/covers/${item.mangaId}/${item.cover}.256.jpg` : null;
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-2 dark:text-white">Continue Reading</Text>
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
            <Text className="text-xs text-pink-500">Capítulo {item.chapter}</Text>
          </Pressable>
        )}
      />
      <Pressable onPress={clearContinueReading} className="bg-red-500 px-4 py-2 rounded">
        <Text className="text-white text-center font-semibold">Borrar historial</Text>
      </Pressable>
    </View>
  );
}
