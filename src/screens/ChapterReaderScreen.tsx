import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  Button,
  Linking,
  Pressable,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { featchGetChapterPages } from '../services/mangaService';
import { fetchAllChapters, fetchMangaById, getChapterPagesExternal } from '../services/mangadexApi';
import { saveMangaToContinueReading } from '../services/storage';
import ChapterReaderControls from '../components/ChapterReaderControls';
import { getOfflineChapter } from '../utils/offlineUtils';
import { markChapterAsRead } from '../utils/readHistory';
import { useIncognito } from '../context/incognito-context';

import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

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
  const [isLoading, setIsLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [manga, setManga] = useState<any>(null);
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});
  const { incognito } = useIncognito();
  const [chapters, setChapters] = useState<any[]>([]);
  const navigation = useNavigation();

  // Zoom global
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Para el pinch gesture
  const baseScale = useSharedValue(1);
  const pinchScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Pan gesture para mover cuando hay zoom
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      // Guardar el punto focal y el scale base actual
      focalX.value = event.focalX;
      focalY.value = event.focalY;
      pinchScale.value = 1;
    },
    onActive: (event) => {
      // Calcular el nuevo scale basado en el scale base + el pinch actual
      const newScale = Math.min(Math.max(baseScale.value * event.scale, MIN_SCALE), MAX_SCALE);
      scale.value = newScale;
      pinchScale.value = event.scale;

      // Si hay zoom, calcular la translación basada en el punto focal
      if (newScale > MIN_SCALE) {
        const deltaX = (event.focalX - focalX.value) * (newScale - baseScale.value);
        const deltaY = (event.focalY - focalY.value) * (newScale - baseScale.value);
        
        translateX.value = savedTranslateX.value + deltaX;
        translateY.value = savedTranslateY.value + deltaY;
      } else {
        translateX.value = 0;
        translateY.value = 0;
      }
    },
    onEnd: () => {
      // Actualizar el scale base con el resultado final
      baseScale.value = scale.value;
      
      // Guardar la posición actual
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // Si el scale es muy pequeño, resetear todo
      if (scale.value < MIN_SCALE + 0.1) {
        baseScale.value = MIN_SCALE;
        scale.value = withTiming(MIN_SCALE, { duration: 200 });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        runOnJS(setIsZoomed)(false);
      } else {
        // Aplicar límites suaves después del zoom
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (SCREEN_WIDTH * (scale.value - 1)) / 2;

        const clampedX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX.value));
        const clampedY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY.value));

        if (clampedX !== translateX.value || clampedY !== translateY.value) {
          translateX.value = withSpring(clampedX, { damping: 15, stiffness: 100 });
          translateY.value = withSpring(clampedY, { damping: 15, stiffness: 100 });
          savedTranslateX.value = clampedX;
          savedTranslateY.value = clampedY;
        }

        runOnJS(setIsZoomed)(scale.value > MIN_SCALE);
      }
    },
  });

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Solo permitir pan si hay zoom
      if (scale.value <= MIN_SCALE) return;
    },
    onActive: (event) => {
      // Solo mover si hay zoom
      if (scale.value > MIN_SCALE) {
        // Calcular límites para evitar que se vaya muy lejos
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (SCREEN_WIDTH * (scale.value - 1)) / 2; // Usar SCREEN_WIDTH como referencia

        const newTranslateX = savedTranslateX.value + event.translationX;
        const newTranslateY = savedTranslateY.value + event.translationY;

        // Aplicar límites suaves
        translateX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, newTranslateX));
        translateY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, newTranslateY));
      }
    },
    onEnd: () => {
      // Guardar la nueva posición
      if (scale.value > MIN_SCALE) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
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
    if (isZoomed) {
      // Reset zoom
      baseScale.value = MIN_SCALE;
      scale.value = withSpring(MIN_SCALE, { damping: 15, stiffness: 100 });
      translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
      setIsZoomed(false);
    } else {
      // Zoom in al centro
      baseScale.value = 2;
      scale.value = withSpring(2, { damping: 15, stiffness: 100 });
      setIsZoomed(true);
    }
  };

  useEffect(() => {
    if (!incognito && chapterId) {
      markChapterAsRead(chapterId);
    }
  }, [chapterId, incognito]);

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        setIsLoading(true);
        
        // Reset zoom cuando cambia el capítulo
        baseScale.value = 1;
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        setIsZoomed(false);

        const localImages = await getOfflineChapter(chapterId);
        if (localImages && localImages.length > 0) {
          setChapterImages(localImages);
          const manga = await fetchMangaById(mangaId);
          setManga(manga);
          return;
        }

        const res = await featchGetChapterPages(chapterId);
        const manga = await fetchMangaById(mangaId);
        setManga(manga);
        const chaptersList = (await fetchAllChapters(mangaId)) ?? [];
        setChapters(chaptersList);

        const { baseUrl, chapter } = res;
        const url = await getChapterPagesExternal(chapterId);
        const attributes = url?.data?.attributes;

        if (!chapter || chapter.data.length === 0) {
          const externalUrl = attributes?.externalUrl;
          setExternalUrl(externalUrl);

          if (!incognito) {
            await saveMangaToContinueReading(manga, chapterId);
          }
        } else {
          const images = chapter.data.map(
            (fileName: string) => `${baseUrl}/data/${chapter.hash}/${fileName}`
          );
          setChapterImages(images);

          if (!incognito) {
            await saveMangaToContinueReading(manga, chapterId);
          }
        }
      } catch (error) {
        console.error('Error fetching chapter images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterPages();
  }, [chapterId, mangaId]);

  const currentChapterIndex = chapters.findIndex((ch) => ch.id === chapterId);

  const goToChapter = (chapterId: string) => {
    navigation.navigate('ChapterReader', { chapterId, mangaId });
  };

  const handleNextChapter = async () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      goToChapter(nextChapter.id);
      if (!incognito) {
        await markChapterAsRead(nextChapter.id);
      }
    }
  };

  const handlePrevChapter = async () => {
    if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      goToChapter(prevChapter.id);
      if (!incognito) {
        await markChapterAsRead(prevChapter.id);
      }
    }
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (externalUrl) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-black">
        <Text className="text-lg font-semibold text-center mb-4 text-white">
          Este capítulo se encuentra en un sitio externo.
        </Text>
        <Button title="Leer capítulo" onPress={() => Linking.openURL(externalUrl)} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <PanGestureHandler onGestureEvent={panGestureHandler} enabled={isZoomed}>
        <Animated.View style={{ flex: 1 }}>
          <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
            <Animated.View style={{ flex: 1 }}>
              <Animated.ScrollView 
                style={[{ flex: 1 }, animatedStyle]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                scrollEnabled={!isZoomed} // Deshabilitar scroll cuando hay zoom
                onScroll={(event) => {
                  if (!isZoomed) {
                    const scrollY = event.nativeEvent.contentOffset.y;
                    let cumulativeHeight = 0;
                    let currentPageIndex = 0;
                    
                    for (let i = 0; i < chapterImages.length; i++) {
                      const imageHeight = imageHeights[chapterImages[i]] ?? SCREEN_WIDTH * 1.5;
                      cumulativeHeight += imageHeight;
                      if (scrollY < cumulativeHeight) {
                        currentPageIndex = i;
                        break;
                      }
                    }
                    
                    setCurrentPage(currentPageIndex);
                  }
                }}
              >
                {chapterImages.map((item, index) => {
                  const imageHeight = imageHeights[item] ?? SCREEN_WIDTH * 1.5;

                  return (
                    <Pressable 
                      key={`${item}-${index}`}
                      onPress={toggleControls}
                      onLongPress={handleDoubleTap}
                      style={{ width: SCREEN_WIDTH, height: imageHeight }}
                    >
                      <Animated.Image
                        source={{ uri: item }}
                        style={{
                          width: SCREEN_WIDTH,
                          height: imageHeight,
                          resizeMode: 'contain',
                        }}
                        onLoad={(e) => {
                          const { width, height } = e.nativeEvent.source;
                          if (width && height) {
                            const scaledHeight = (SCREEN_WIDTH / width) * height;
                            setImageHeights((prev) => ({ ...prev, [item]: scaledHeight }));
                          }
                        }}
                      />
                    </Pressable>
                  );
                })}
              </Animated.ScrollView>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {showControls && (
        <ChapterReaderControls
          currentPage={currentPage + 1} // +1 porque currentPage es 0-indexed
          totalPages={chapterImages.length}
          onClose={() => setShowControls(false)}
          onNextChapter={handleNextChapter}
          onPrevChapter={handlePrevChapter}
          manga={manga}
        />
      )}
    </View>
  );
}