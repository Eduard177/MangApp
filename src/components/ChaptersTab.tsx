import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ChapterItem from './ChaptersItem';
import { getReadChapters } from '../utils/readHistory';

export default function ChaptersTab({
  chapters,
  loading,
  fetchChapters,
  mangaId,
  navigation,
}: any) {

  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    loadReadChapters();
  }, []);

  const loadReadChapters = async () => {
    const stored = await getReadChapters();
    setReadChapters(stored);
  };

  const handleChapterRead = (chapterId: string) => {
    setReadChapters((prev) => [...new Set([...prev, chapterId])]);
  };

  return (
    <FlatList
      data={chapters}
      keyExtractor={(item) => item.id}
      onEndReached={fetchChapters}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <ChapterItem
          item={item}
          mangaId={mangaId}
          navigation={navigation}
          isRead={readChapters.includes(item.id)}
          onMarkAsRead={handleChapterRead}
        />
      )}
      ListFooterComponent={loading ? <ActivityIndicator className="my-4" /> : null}
    />
  );
}
