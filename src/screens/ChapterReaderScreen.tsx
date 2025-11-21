import React, { useEffect, useState } from 'react';
import { View, Text, Button, Linking, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReaderModeStore, ReaderMode } from '../store/useReaderModeStore';

import VerticalScrollReader from '../components/reading/VerticalScrollReader';
import HorizontalPageReader from '../components/reading/HorizontalPageReader';
import HorizontalPageReaderLTR from '../components/reading/HorizontalPageReaderLTR';

import SimpleSVGSpinner from '../assets/components/AnimateSpinner';
import { getOfflineChapter } from '../utils/downloadChapter';
import { fetchMangaById, fetchAllChapters, getChapterPagesExternal } from '../services/mangadexApi';
import { featchGetChapterPages } from '../services/mangaService';
import { saveMangaToContinueReading } from '../services/storage';
import { markChapterAsRead } from '../utils/readHistory';
import { useIncognito } from '../context/incognito-context';
import { Image } from 'expo-image';

const SCREEN_WIDTH = Dimensions.get('window').width;
const STORAGE_KEY = 'readerMode';

export default function ChapterReaderScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { incognito } = useIncognito();
  const { mode, setMode } = useReaderModeStore();

  const { chapterId, mangaId, page = 0 } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [manga, setManga] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    const loadMode = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'vertical' || saved === 'horizontal-rtl' || saved === 'horizontal-ltr') {
          setMode(saved as ReaderMode);
        }
      } catch (e) {
        console.warn('Error loading reader mode from storage:', e);
      }
    };
    loadMode();
  }, []);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setIsLoading(true);

        const local = await getOfflineChapter(chapterId);
        const mangaData = await fetchMangaById(mangaId);
        setManga(mangaData);

        if (local?.length) {
          setImages(local);
          return;
        }

        const res = await featchGetChapterPages(chapterId);
        const url = await getChapterPagesExternal(chapterId);
        const attributes = url?.data?.attributes;

        const chaptersList = (await fetchAllChapters(mangaId)) ?? [];
        setChapters(chaptersList);

        if (!res.chapter || res.chapter.data.length === 0) {
          setExternalUrl(attributes?.externalUrl ?? null);
          if (!incognito) await saveMangaToContinueReading(mangaData, chapterId);
          return;
        }

        const imagesList = res.chapter.data.map(
          (name: string) => `${res.baseUrl}/data/${res.chapter.hash}/${name}`
        );
        setImages(imagesList);

        // Optimización de carga: Precarga progresiva por lotes (Chunk Loading)
        const preloadImages = async () => {
          try {
            // 1. Prioridad Alta: Cargar las primeras 3 imágenes inmediatamente para que el usuario pueda empezar a leer
            await Promise.all(imagesList.slice(0, 3).map((url) => Image.prefetch(url)));

            // 2. Carga progresiva del resto en lotes (chunks) para no saturar la red ni la memoria
            const chunkSize = 5;
            for (let i = 3; i < imagesList.length; i += chunkSize) {
              const chunk = imagesList.slice(i, i + chunkSize);
              // Precargamos el lote actual
              await Promise.all(chunk.map((url) => Image.prefetch(url)));
              // Pequeña pausa para liberar recursos si es necesario
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (err) {
            console.warn('Error en precarga de imágenes:', err);
          }
        };
        
        // Iniciamos la precarga sin bloquear el renderizado
        preloadImages();

        if (!incognito) await saveMangaToContinueReading(mangaData, chapterId);
      } catch (e) {
        console.error('Error fetching chapter:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
    if (!incognito) markChapterAsRead(chapterId);
  }, [chapterId, mangaId]);

  useEffect(() => {
    const index = chapters.findIndex((c) => c.id === chapterId);
    setCurrentChapterIndex(index);
  }, [chapters, chapterId]);

  const goToChapter = (id: string) => {
    navigation.replace('ChapterReader', { chapterId: id, mangaId });
  };

  if (isLoading) {
    return <View className="flex-1 justify-center items-center bg-black"><SimpleSVGSpinner/></View>;
  }

  if (externalUrl) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-6">
        <Text className="text-white text-lg text-center mb-4">Este capítulo se encuentra en un sitio externo.</Text>
        <Button title="Leer capítulo" onPress={() => Linking.openURL(externalUrl)} />
      </View>
    );
  }

  const sharedProps = {
    images,
    manga,
    chapters,
    currentChapterIndex,
    goToChapter,
    navigation,
    initialPage: page,
    chapterId
  };

  if (mode === 'horizontal-rtl') {
    return <HorizontalPageReader {...sharedProps} />;
  }

  if (mode === 'horizontal-ltr') {
    return <HorizontalPageReaderLTR {...sharedProps} />;
  }

  return <VerticalScrollReader {...sharedProps} />;
}
