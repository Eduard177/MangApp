import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Button,
  Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { featchGetChapterPages } from '../services/mangaService';
import { fetchMangaById, getChapterPagesExternal } from '../services/mangadexApi';
import {  saveMangaToContinueReading } from '../services/storage';


const SCREEN_WIDTH = Dimensions.get('window').width;

type RootStackParamList = {
  ChapterReader: {
    chapterId: string;
    mangaId: string;
  };
};

export default function ChapterReader() {
  const route = useRoute<RouteProp<RootStackParamList, 'ChapterReader'>>();
  const { chapterId, mangaId } = route.params;
  console.log(chapterId, mangaId);
  const [isLoading, setIsLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        setIsLoading(true);
        const res = await featchGetChapterPages(chapterId);
        const manga = await fetchMangaById(mangaId);
        const { baseUrl, chapter } = res;
        const url = await getChapterPagesExternal(chapterId);
        const atributes = url?.data?.attributes;

        if (!chapter || chapter.data.length === 0) {
          const externalUrl = atributes?.externalUrl;
          setExternalUrl(externalUrl);
          console.log(chapter)

        await saveMangaToContinueReading(manga, chapterId);
        } else {
          const images = chapter.data.map(
            (fileName: string) => `${baseUrl}/data/${chapter.hash}/${fileName}`,
          );
          setChapterImages(images);

         await saveMangaToContinueReading(manga, chapterId);
        }
      } catch (error) {
        console.error('Error fetching chapter images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterPages();
  }, [chapterId]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (externalUrl) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg font-semibold text-center mb-4">
          Este capítulo se encuentra en un sitio externo.
        </Text>
        <Button title="Leer capítulo" onPress={() => Linking.openURL(externalUrl)} />
      </View>
    );
  }

  return (
    <FlatList
      data={chapterImages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{ width: SCREEN_WIDTH, height: 600, resizeMode: 'contain' }}
        />
      )}
    />
  );
}
