import React, { useState } from 'react';
import { View, Dimensions, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import ChapterReaderControls from '../ChapterReaderControls';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HorizontalPageReader({
  images,
  manga,
  chapters,
  currentChapterIndex,
  goToChapter,
  navigation,
  initialPage = 0,
}: any) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showControls, setShowControls] = useState(true);

  if (!images || images.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        inverted
        initialScrollIndex={initialPage}
        keyExtractor={(item, i) => `${item}-${i}`}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setShowControls((prev) => !prev)}
            style={{ width: SCREEN_WIDTH, height: '100%' }}
          >
            <Image
              source={{ uri: item }}
              style={{ width: SCREEN_WIDTH, height: '100%' }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Pressable>
        )}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(page);
        }}
        showsHorizontalScrollIndicator={false}
      />

      {showControls && (
        <ChapterReaderControls
          currentPage={currentPage}
          totalPages={images.length}
          manga={manga}
          onClose={() => navigation.goBack()}
          onNextChapter={() => {
            if (currentChapterIndex < chapters.length - 1) goToChapter(chapters[currentChapterIndex + 1].id);
          }}
          onPrevChapter={() => {
            if (currentChapterIndex > 0) goToChapter(chapters[currentChapterIndex - 1].id);
          }}
        />
      )}
    </View>
  );
}
