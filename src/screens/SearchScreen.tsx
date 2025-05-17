import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Button,
} from 'react-native';
import { searchManga } from '../services/mangadexApi';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 10;

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchManga(newQuery, ['en'], LIMIT, 0);
      setResults(data.data ?? []);
      setOffset(LIMIT);
      setHasMore(data.length === LIMIT);
    } catch (e) {
      console.error('Error during search', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await searchManga(query, ['en'], LIMIT, offset);
      setResults((prev) => [...prev, ...data]);
      setOffset((prev) => prev + LIMIT);
      setHasMore(data.length === LIMIT);
    } catch (e) {
      console.error('Error loading more', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) handleSearch(query);
      else {
        setResults([]);
        setOffset(0);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const getCoverUrl = (manga: any) => {
    const cover = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
    return cover?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
      : null;
  };

  let listFooter = null;
  if (results.length > 0) {
    if (loading) {
      listFooter = (
        <View className="my-4 items-center">
          <ActivityIndicator size="small" />
        </View>
      );
    } else if (hasMore) {
      listFooter = (
        <View className="my-4 items-center">
          <Pressable onPress={loadMore} className="bg-blue-600 px-4 py-2 rounded">
            <Text className="text-white font-semibold">Ver más resultados</Text>
          </Pressable>
        </View>
      );
    } else {
      listFooter = (
        <View className="my-4 items-center">
          <Text className="text-gray-500 mt-2">No hay más resultados</Text>
        </View>
      );
    }
  }

  return (
    <View className="flex-1 pt-12 px-4 bg-white dark:bg-black">
      <TextInput
        placeholder="Buscar manga..."
        placeholderTextColor="#999"
        className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded mb-4 text-black dark:text-white"
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={() => handleSearch(query)}
      />

      {loading && results.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('MangaDetails', { manga: item })}
              className="flex-row mb-4 space-x-4 items-center"
            >
              <Image
                source={{ uri: getCoverUrl(item) }}
                style={{ width: 60, height: 90, borderRadius: 4 }}
              />
              <Text className="text-base text-black dark:text-white flex-1">
                {item.attributes?.title?.en ?? 'Sin título'}
              </Text>
            </Pressable>
          )}
          ListFooterComponent={listFooter}
        />
      )}
    </View>
  );
}
