import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSavedMangas } from '../services/favorites';
import { isMangaDownloaded } from '../utils/downloadManga';
import { getReadChaptersForManga } from '../utils/readHistory';
import { getMangaAllChapters } from '../services/mangadexApi';
import SavedMangaSkeleton from './loading/MangaSaveListSkeleton';

interface Props {
  numColumns?: number;
  filters?: {
    onlyDownloaded?: boolean;
    unread?: boolean;
    completed?: boolean;
    started?: boolean;
  };
}

export default function SavedMangasGrid({ numColumns = 3, filters = {} }: Readonly<Props>) {
  const [savedMangas, setSavedMangas] = useState<any[]>([]);
  const [filteredMangas, setFilteredMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const processMangaItem = async (item: any) => {
    const mangaId = item.manga.id;
    const chapters = await getMangaAllChapters(mangaId);
    const chapterIds = chapters.map((chapter: any) => chapter.id);
    const totalChapters = chapterIds.length;

    const readChapters = await getReadChaptersForManga(mangaId, chapterIds);
    let isDownloaded = false;
    if (chapterIds.length > 0) {
      isDownloaded = await isMangaDownloaded(mangaId, chapterIds);
    }

    return {
      ...item,
      chapterIds,
      readChapters,
      totalChapters,
      isDownloaded,
    };
  };

  const getCoverUrl = (item: any) => {
    const fileName = item?.cover;
    return fileName ? `https://uploads.mangadex.org/covers/${item.manga.id}/${fileName}.256.jpg` : null;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSavedMangas();
        const mangasConProgreso = await Promise.all(data.map(processMangaItem));

        let result = mangasConProgreso;

        if (filters.onlyDownloaded) {
          result = result.filter((m) => m.isDownloaded);
        }

        if (filters.unread) {
          result = result.filter((m) => m.readChapters.length === 0);
        }

        if (filters.completed) {
          result = result.filter((m) => m.totalChapters > 0 && m.readChapters.length === m.totalChapters);
        }

        if (filters.started) {
          result = result.filter((m) => m.readChapters.length > 0 && m.readChapters.length < m.totalChapters);
        }

        setSavedMangas(data);
        setFilteredMangas(result);
      } catch (e) {
        console.error('Error loading saved mangas:', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters]);

  const itemWidth = Dimensions.get('window').width / numColumns - 16;

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() => navigation.navigate('MangaDetails', { manga: item.manga })}
      className="mb-4"
      style={{ width: itemWidth, marginHorizontal: 4 }}
    >
      <Image
        source={{
          uri: getCoverUrl(item),
        }}
        style={{ width: '100%', height: itemWidth * 1.5, borderRadius: 8 }}
      />
      <Text
        className="mt-1 text-sm font-medium text-left text-black dark:text-white"
        numberOfLines={1}
      >
        {item.title ?? 'Sin título'}
      </Text>
    </Pressable>
  );

  if (loading) {
    return <SavedMangaSkeleton numColumns={numColumns} />;
  }

  if (!filteredMangas || filteredMangas.length === 0) {
    return null;
  }

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-2 dark:text-white">Saved</Text>
      <FlatList
        data={filteredMangas}
        key={numColumns}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.manga.id}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
}
