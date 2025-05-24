import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, FlatList, Pressable, ActivityIndicator, View } from 'react-native';

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
        <Pressable
          onPress={() =>
            navigation.navigate('ChapterReader', {
              chapterId: item.id,
              mangaId,
            })
          }
          className="px-4 py-1 dark:border-gray-700"
        >
          <View className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center">
            <View className="flex-1 flex-row items-center space-x-1">
              <Text className="text-black dark:text-white text-base font-medium">
                Capítulo {item.attributes.chapter ?? 'N/A'}
              </Text>
              <Text className="text-sm text-gray-900 font-open-sans dark:text-gray-300">
                {item.attributes.title ?? 'Sin título'}
              </Text>
            </View>
            <Pressable onPress={() => console.log('Download pressed')}>
              <Ionicons name="cloud-download" size={25} className="" />
            </Pressable>
          </View>
        </Pressable>
      )}
      ListFooterComponent={loading ? <ActivityIndicator className="my-4" /> : null}
    />
  );
}
