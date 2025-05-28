import React from 'react';
import {
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ChapterItem from './ChaptersItem';

export default function ChaptersTab({
  chapters,
  loading,
  fetchChapters,
  mangaId,
  navigation,
}: any) {
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
        />
      )}
      ListFooterComponent={loading ? <ActivityIndicator className="my-4" /> : null}
    />
  );
}
