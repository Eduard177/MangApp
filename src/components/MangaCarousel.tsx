import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface MangaCarouselProps {
  title: string;
  fetchFunction: (offset: number, limit: number, data?: any) => Promise<any[]>;
  data?: any;
}

const LIMIT = 5;
const MAX_TOTAL = 20;

export const getCoverUrl = (item: any) => {
  const manga = item.manga ?? item;
  const fileName = manga?.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes
    ?.fileName;
  return fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : null;
};

function MangaCarousel({ title, fetchFunction, data }: Readonly<MangaCarouselProps>) {
  const [mangas, setMangas] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await fetchFunction(LIMIT, offset, data);
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

  const getGendersNames = (tags: any[] = []) => {
    const genreTags = tags.filter((tag) => tag.attributes.group === 'genre');
    if (genreTags.length === 0) return 'Sin Genero';
    return genreTags
      .map((tag) => tag.attributes?.name?.en)
      .filter(Boolean)
      .join(' • ');
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <View className="mb-6 min-h-[240px]">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      <FlatList
        horizontal
        data={mangas}
        keyExtractor={(item, index) => `${title}-${item.id}-${index}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('MangaDetails', { manga: item })}
            className="mr-4"
          >
            <Image
              source={{ uri: getCoverUrl(item) }}
              style={{ width: 120, height: 180, borderRadius: 8 }}
            />
            <Text numberOfLines={1} className="mt-1 w-28 text-sm font-medium text-left">
              {item.manga?.attributes?.title?.en ??
                item.attributes?.title?.en ??
                item.manga?.attributes?.altTitles?.find((t) => t.en)?.en ??
                item.attributes?.altTitles?.find((t) => t.en)?.en ??
                'Sin título'}
              {/* manga.attributes.title.en ?? manga.attributes.altTitles?.find(t => t.en)?.en */}
            </Text>
            <Text
              numberOfLines={2}
              className="mt-1 w-28 text-xs text-gray-400 leading-tight text-left"
            >
              {getGendersNames(item.manga?.attributes?.tags ?? item.attributes?.tags)}
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

export default React.memo(MangaCarousel);
