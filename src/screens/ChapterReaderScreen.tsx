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
import { getChapterPagesExternal, getChaptersByMangaId } from '../services/mangadexApi';

const SCREEN_WIDTH = Dimensions.get('window').width;

type RootStackParamList = {
  ChapterReader: {
    chapterId: string;
  };
};

export default function ChapterReader() {
  const route = useRoute<RouteProp<RootStackParamList, 'ChapterReader'>>();
  const { chapterId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        setIsLoading(true);
        const res = await featchGetChapterPages(chapterId);
        const { baseUrl, chapter } = res;

        if (!chapter || chapter.data.length === 0) {
          // Capítulo externo
          const url = await getChapterPagesExternal(chapterId);

          const externalUrl = url.data.attributes.externalUrl;
          console.log('URL:', externalUrl);
          setExternalUrl(externalUrl);
        } else {
          const images = chapter.data.map(
            (fileName: string) => `${baseUrl}/data/${chapter.hash}/${fileName}`,
          );
          setChapterImages(images);
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
