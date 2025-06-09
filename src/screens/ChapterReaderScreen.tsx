import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Button,
  Linking,
  Pressable,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  fetchAllChapters,
  fetchMangaById,
  getChapterPagesExternal,
} from '../services/mangadexApi';
import { saveMangaToContinueReading } from '../services/storage';
import ChapterReaderControls from '../components/ChapterReaderControls';
import { getOfflineChapter } from '../utils/offlineUtils';
import { markChapterAsRead } from '../utils/readHistory';
import { useIncognito } from '../context/incognito-context';
import { Image } from 'expo-image';

import { PinchGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { featchGetChapterPages } from '../services/mangaService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

type RootStackParamList = {
  ChapterReader: {
    chapterId: string;
    mangaId: string;
  };
};

export default function ChapterReader() {
  const route = useRoute<RouteProp<RootStackParamList, 'ChapterReader'>>();
  const { chapterId, mangaId } = route.params;
  const navigation = useNavigation();
  const { incognito } = useIncognito();

  const [isLoading, setIsLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [manga, setManga] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Zoom & pan shared values
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    baseScale.value = MIN_SCALE;
    scale.value = withSpring(MIN_SCALE);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    setIsZoomed(false);
  };

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (e) => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
      pinchScale.value = 1;
    },
    onActive: (e) => {
      const newScale = Math.min(Math.max(baseScale.value * e.scale, MIN_SCALE), MAX_SCALE);
      scale.value = newScale;
      if (newScale > MIN_SCALE) {
        translateX.value = savedTranslateX.value + (e.focalX - focalX.value) * (newScale - baseScale.value);
        translateY.value = savedTranslateY.value + (e.focalY - focalY.value) * (newScale - baseScale.value);
      }
    },
    onEnd: () => {
      baseScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      if (scale.value <= MIN_SCALE + 0.1) {
        runOnJS(resetZoom)();
      } else {
        const maxX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const clampedX = Math.max(-maxX, Math.min(maxX, translateX.value));
        const clampedY = Math.max(-maxX, Math.min(maxX, translateY.value));
        translateX.value = withSpring(clampedX);
        translateY.value = withSpring(clampedY);
        savedTranslateX.value = clampedX;
        savedTranslateY.value = clampedY;
        runOnJS(setIsZoomed)(scale.value > MIN_SCALE);
      }
    },
  });

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (scale.value > MIN_SCALE) {
        const maxX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        translateX.value = Math.max(-maxX, Math.min(maxX, savedTranslateX.value + event.translationX));
        translateY.value = Math.max(-maxX, Math.min(maxX, savedTranslateY.value + event.translationY));
      }
    },
    onEnd: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleDoubleTap = () => {
    isZoomed ? resetZoom() : (() => {
      baseScale.value = 2;
      scale.value = withSpring(2);
      setIsZoomed(true);
    })();
  };

  const fetchChapter = async () => {
    try {
      setIsLoading(true);
      resetZoom();

      const local = await getOfflineChapter(chapterId);
      const manga = await fetchMangaById(mangaId);
      setManga(manga);

      if (local?.length) {
        setChapterImages(local);
        return;
      }

      const res = await featchGetChapterPages(chapterId);
      const url = await getChapterPagesExternal(chapterId);
      const attributes = url?.data?.attributes;

      const chaptersList = (await fetchAllChapters(mangaId)) ?? [];
      setChapters(chaptersList);

      if (!res.chapter || res.chapter.data.length === 0) {
        setExternalUrl(attributes?.externalUrl ?? null);
        if (!incognito) await saveMangaToContinueReading(manga, chapterId);
        return;
      }

      const firstImage = `${res.baseUrl}/data/${res.chapter.hash}/${res.chapter.data[0]}`;
      await Image.prefetch(firstImage);

      const images = res.chapter.data.map(
        (name: string) => `${res.baseUrl}/data/${res.chapter.hash}/${name}`
      );
      setChapterImages(images);
      if (!incognito) await saveMangaToContinueReading(manga, chapterId);
    } catch (e) {
      console.error('Error fetching chapter:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
    if (!incognito) markChapterAsRead(chapterId);
  }, [chapterId, mangaId]);

  const currentChapterIndex = chapters.findIndex((ch) => ch.id === chapterId);
  const goToChapter = (id: string) => navigation.navigate('ChapterReader', { chapterId: id, mangaId });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isZoomed) {
      const scrollY = e.nativeEvent.contentOffset.y;
      let sum = 0;
      for (let i = 0; i < chapterImages.length; i++) {
        sum += imageHeights[chapterImages[i]] ?? SCREEN_WIDTH * 1.5;
        if (scrollY < sum) return setCurrentPage(i);
      }
    }
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center bg-black"><ActivityIndicator color="#fff" /></View>;
  }

  if (externalUrl) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-6">
        <Text className="text-white text-lg text-center mb-4">Este capítulo se encuentra en un sitio externo.</Text>
        <Button title="Leer capítulo" onPress={() => Linking.openURL(externalUrl)} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <PanGestureHandler onGestureEvent={panGestureHandler} enabled={isZoomed}>
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
              <FlatList
                data={chapterImages}
                keyExtractor={(item, i) => `${item}-${i}`}
                renderItem={({ item }) => {
                  const height = imageHeights[item] ?? SCREEN_WIDTH * 1.5;
                  return (
                    <Pressable
                      onPress={() => setShowControls((prev) => !prev)}
                      onLongPress={handleDoubleTap}
                      style={{ width: SCREEN_WIDTH, height }}
                    >
                      <Image
                        source={{ uri: item }}
                        style={{ width: SCREEN_WIDTH, height: Math.min(height, 2048) }}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        onLoad={(e) => {
                          const { width, height } = e.source;
                          if (width && height) {
                            const scaledHeight = (SCREEN_WIDTH / width) * height;
                            setImageHeights((prev) => ({ ...prev, [item]: scaledHeight }));
                          }
                        }}
                      />
                    </Pressable>
                  );
                }}
                onScroll={handleScroll}
                scrollEnabled={!isZoomed}
                showsVerticalScrollIndicator={false}
                initialNumToRender={3}
                windowSize={5}
                maxToRenderPerBatch={4}
                removeClippedSubviews={true}
              />
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {showControls && (
        <ChapterReaderControls
          currentPage={currentPage + 1}
          totalPages={chapterImages.length}
          manga={manga}
          onClose={() => setShowControls(false)}
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
