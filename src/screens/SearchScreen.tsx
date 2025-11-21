import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { searchManga } from '../services/mangadexApi';

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const LIMIT = 20;
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 32) / numColumns - 8;

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchManga(newQuery, LIMIT, 0);
      setResults(data.data ?? []);
      setOffset(LIMIT);
      setHasMore((data?.data?.length ?? 0) === LIMIT);
    } catch (e) {
      console.error('Error during search', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    try {
      const data = await searchManga(query, LIMIT, offset);
      const newResults = data?.data ?? [];
      if (newResults.length > 0) {
        setResults((prev) => [...prev, ...newResults]);
        setOffset((prev) => prev + LIMIT);
        setHasMore(newResults.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error loading more', e);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) handleSearch(query);
      else {
        setResults([]);
        setOffset(0);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const getCoverUrl = (manga: any) => {
    const cover = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
    return cover?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
      : null;
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() => navigation.navigate('MangaDetails', { manga: item })}
      style={{ width: itemWidth, margin: 4 }}
    >
      <View className="relative">
        <Image
          source={{ uri: getCoverUrl(item) }}
          style={{ width: '100%', height: itemWidth * 1.45, borderRadius: 12 }}
          className="bg-gray-200 dark:bg-gray-700"
        />
      </View>
      <Text 
        numberOfLines={2} 
        className="mt-2 text-xs font-semibold text-gray-800 dark:text-gray-200"
      >
        {item.attributes?.title?.en ?? item.attributes?.title?.['ja-ro'] ?? 'Unknown Title'}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800">
        <Pressable 
            onPress={() => navigation.goBack()} 
            className="mr-3 p-1 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
        </Pressable>
        
        <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2.5">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-2 text-base text-black dark:text-white"
            placeholder="Search manga..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {loading && results.length === 0 ? (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={{ padding: 12 }}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && query.trim().length > 0 ? (
                <View className="flex-1 items-center justify-center mt-20">
                    <Ionicons name="search-outline" size={64} color={isDark ? '#374151' : '#E5E7EB'} />
                    <Text className="mt-4 text-gray-400 text-base">No results found</Text>
                </View>
            ) : (
                <View className="flex-1 items-center justify-center mt-20">
                    <Ionicons name="library-outline" size={64} color={isDark ? '#374151' : '#E5E7EB'} />
                    <Text className="mt-4 text-gray-400 text-base">Search for your favorite manga</Text>
                </View>
            )
          }
          ListFooterComponent={
            loading && results.length > 0 ? (
              <ActivityIndicator className="my-4" color={isDark ? 'white' : 'black'} />
            ) : null
          }
        />
      )}
    </View>
  );
}