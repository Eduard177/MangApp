import React, { useState } from 'react';
import {
  View,
  Pressable,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Image } from 'expo-image';

import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import ChapterReaderControls from '../ChapterReaderControls';
import { saveMangaToContinueReading } from '../../services/storage';
import { useIncognito } from '../../context/incognito-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

export default function VerticalScrollReader({
  images,
  manga,
  chapters,
  currentChapterIndex,
  goToChapter,
  navigation,
  initialPage = 0,
  chapterId,
}: any) {
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showControls, setShowControls] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const { incognito } = useIncognito();

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
    isZoomed
      ? resetZoom()
      : (() => {
          baseScale.value = 2;
          scale.value = withSpring(2);
          setIsZoomed(true);
        })();
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isZoomed) {
      const scrollY = e.nativeEvent.contentOffset.y;
      let sum = 0;
      for (let i = 0; i < images.length; i++) {
        sum += imageHeights[images[i]] ?? SCREEN_WIDTH * 1.5;
        if (scrollY < sum) {
          setCurrentPage(i);
          if (!incognito && manga && chapterId) {
            saveMangaToContinueReading(manga, chapterId, i);
          }
          return;
        }
      }
    }
  };

  const getItemLayout = (_: any, index: number) => {
    const defaultHeight = SCREEN_WIDTH * 1.5;
    const height = images[index] ? (imageHeights[images[index]] ?? defaultHeight) : defaultHeight;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      const h = images[i] ? (imageHeights[images[i]] ?? defaultHeight) : defaultHeight;
      offset += h;
    }

    return {
      length: height,
      offset,
      index,
    };
  };

  if (!images || images.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Animated.Text style={{ color: 'white' }}>Loading images...</Animated.Text>
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
                data={images}
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
                getItemLayout={getItemLayout}
                initialScrollIndex={initialPage}
                windowSize={5}
                maxToRenderPerBatch={4}
                removeClippedSubviews={true}
                onScrollToIndexFailed={(info) => {
                  console.warn('Scroll to index failed', info);
                }}
              />
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

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
