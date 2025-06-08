import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const LIMIT = 8;
const MAX_TOTAL = 20;

export const getCoverUrl = (item: any) => {
  const manga = item.manga ?? item;
  const fileName = manga?.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName;
  return fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
    : null;
};

type Filters = {
  orderBy?: 'rating' | 'followedCount' | 'createdAt' | 'updatedAt';
  direction?: 'asc' | 'desc';
};

interface MangaCarouselProps {
  title: string;
  fetchFunction?: (
    limit: number,
    offset: number,
    filters?: Filters,
    genderId?: string
  ) => Promise<any[]>;
  initialData?: any[];
  data?: string; // genderId u otro dato contextual
  filters?: Filters;
}

function MangaCarousel({
  title,
  fetchFunction,
  data,
  filters = {},
  initialData = [],
}: Readonly<MangaCarouselProps>) {
  const [mangas, setMangas] = useState<any[]>(initialData);
  const [offset, setOffset] = useState(initialData.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const CACHE_KEY = `carousel-cache-${title}`;

  useEffect(() => {
    const loadCache = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setMangas(parsed);
          setOffset(parsed.length);
        } else {
          loadMore(true);
        }
      } catch (e) {
        console.error('Error loading cache:', e);
      }
    };

    loadCache();
  }, []);

  useEffect(() => {
    loadMore(true);
  }, [filters]);

  const loadMore = async (replace = false) => {
    if (!fetchFunction || loading || (!hasMore && !replace)) return;

    setLoading(true);
    try {
      const newData = await fetchFunction(LIMIT, replace ? 0 : offset, filters, data);
      const filtered = newData?.filter((item: any) =>
        replace ? true : !mangas.find((m) => m.id === item.id)
      ) || [];

      const updated = replace ? filtered : [...mangas, ...filtered];
      setMangas(updated);
      setOffset(replace ? LIMIT : offset + LIMIT);

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));

      if (updated.length >= MAX_TOTAL || filtered.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      console.error('Error loading more mangas:', e);
    } finally {
      setLoading(false);
    }
  };

  const getGendersNames = (tags: any[] = []) => {
    const genreTags = tags.filter((tag) => tag.attributes.group === 'genre');
    return genreTags.length === 0
      ? 'Sin Género'
      : genreTags
          .map((tag) => tag.attributes?.name?.en)
          .filter(Boolean)
          .join(' • ');
  };

  return (
    <View className="mb-6 min-h-[240px] dark:bg-gray-900">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold dark:text-white">{title}</Text>     
          <Pressable
            onPress={() =>
              navigation.navigate('MangaListScreen', { title, data, filters })
            }
          >
            <Ionicons name="arrow-forward" size={26} color="#ec4899" />
          </Pressable>
      </View>

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
            <Text
              numberOfLines={1}
              className="mt-1 w-28 text-sm font-medium text-left dark:text-white"
            >
              {item.manga?.attributes?.title?.en ??
                item.attributes?.title?.en ??
                item.manga?.attributes?.altTitles?.find((t) => t.en)?.en ??
                item.attributes?.altTitles?.find((t) => t.en)?.en ??
                'Sin título'}
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
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator className="ml-4" /> : null}
      />
    </View>
  );
}

export default React.memo(MangaCarousel);
