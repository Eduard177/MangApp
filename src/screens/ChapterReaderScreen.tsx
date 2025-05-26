import React, { useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Button,
  Linking,
  Pressable,
  ViewToken
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { featchGetChapterPages } from '../services/mangaService';
import { fetchMangaById, getChapterPagesExternal } from '../services/mangadexApi';
import {  saveMangaToContinueReading } from '../services/storage';
import ChapterReaderControls from '../components/ChapterReaderControls';

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
  const [isLoading, setIsLoading] = useState(true);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [manga, setManga] = useState<any>(null);
  const screenHeight = Dimensions.get('window').height;


  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        setIsLoading(true);
        const res = await featchGetChapterPages(chapterId);
        const manga = await fetchMangaById(mangaId);
        setManga(manga);
        const { baseUrl, chapter } = res;
        const url = await getChapterPagesExternal(chapterId);
        const atributes = url?.data?.attributes;

        if (!chapter || chapter.data.length === 0) {
          const externalUrl = atributes?.externalUrl;
          setExternalUrl(externalUrl);

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

    const viewabilityConfig = {
      viewAreaCoveragePercentThreshold: 50,
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? 0;
        setCurrentPage(index);
      }
    }).current;


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
    <View className="flex-1 bg-black">
    <FlatList
      data={chapterImages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <Pressable onPress={() => setShowControls(!showControls)}>
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height: screenHeight }} // usar height completo
            resizeMode="contain"
          />
        </Pressable>
      )}
      pagingEnabled
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      getItemLayout={(_, index) => ({
        length: screenHeight,
        offset: screenHeight * index,
        index,
      })}
    />

    {showControls && (
        <ChapterReaderControls
          currentPage={currentPage}
          totalPages={chapterImages.length}
          onClose={() => setShowControls(false)}
          onNextChapter={() => console.log('Siguiente capítulo')}
          onPrevChapter={() => console.log('Capítulo anterior')}
          onSave={() => console.log('Guardar manga')}
          manga={manga}
        />
      )}

    </View>
  );
}
