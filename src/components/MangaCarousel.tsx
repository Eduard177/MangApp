import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface MangaCarouselProps {
  title: string;
  fetchFunction: (offset: number, limit: number) => Promise<any[]>;
}

const LIMIT = 5;
const MAX_TOTAL = 15;

export const getCoverUrl = (item: any) => {
  const manga = item.manga ?? item;
  const fileName = manga?.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName;
  return fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : null;
};

export default function MangaCarousel({ title, fetchFunction }: Readonly<MangaCarouselProps>) {
  const [mangas, setMangas] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await fetchFunction(LIMIT, offset);
      const filtered = newData.filter((item: any) => !mangas.find((m) => m.id === item.id));

      const updated = [...mangas, ...filtered];
      setMangas(updated);
      setOffset((prev) => prev + LIMIT);

      if (updated.length >= MAX_TOTAL || filtered.length < LIMIT) {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error loading more mangas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      <FlatList
        horizontal
        data={mangas}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('MangaDetails', { manga: item })}
            className="mr-4"
          >
            <Image
              source={{ uri: getCoverUrl(item) }}
              style={{ width: 120, height: 180, borderRadius: 8 }}
            />
            <Text className="mt-1 w-28 text-sm font-medium text-center">
              {item.manga?.attributes?.title?.en ?? item.attributes?.title?.en ?? 'Sin título'}
            </Text>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator className="ml-4" /> : null}
      />
    </View>
  );
}
