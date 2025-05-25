import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { getAuthorManga, getChaptersByMangaId } from '../services/mangadexApi';
import ChaptersTab from '../components/ChaptersTab';
import { Ionicons } from '@expo/vector-icons';

const initialLayout = { width: Dimensions.get('window').width };
const screenHeight = Dimensions.get('window').height;

type RootStackParamList = {
  MangaDetails: { manga: any };
  ChapterReader: { chapterId: string; mangaId: string };
};

export default function MangaDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'MangaDetails'>>();
  const { manga } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [chapters, setChapters] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [routes] = useState([
    { key: 'general', title: 'General' },
    { key: 'chapters', title: 'Chapters' },
  ]);

  const fetchChapters = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getChaptersByMangaId(manga.id, 20, offset);
      const newChapters = response.data ?? [];
      setChapters((prev) => [...prev, ...newChapters]);
      setOffset((prev) => prev + 20);
      setHasMore(newChapters.length === 20);
    } catch (err) {
      console.error('Fetch chapters error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = async () => {
    try {
      const author = manga.relationships?.find((rel: any) => rel.type === 'author');
      if (author) {
        const authorName = await getAuthorManga(author.id);
        setAuthorName(authorName.attributes.name);
      }
    } catch (error) {
      console.error('Error fetching author name:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
    getAuthorName();
  }, []);

  const GeneralRoute = () => (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
        {manga.attributes.description?.en ?? 'No description available.'}
      </Text>
      <Text className="font-semibold mb-1">Genres:</Text>
      <Text className="text-sm text-gray-600">
        {manga.attributes.tags
          ?.map((tag: { attributes: { name: { en: any } } }) => tag.attributes.name.en)
          .join(', ') ?? 'Unknown'}
      </Text>
    </ScrollView>
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'general':
        return <GeneralRoute />;
      case 'chapters':
        return (
          <ChaptersTab
            chapters={chapters}
            loading={loading}
            fetchChapters={fetchChapters}
            mangaId={manga.id}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="relative">
        <Image
          source={{
            uri: `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships?.find((r) => r.type === 'cover_art')?.attributes.fileName}.256.jpg`,
          }}
          style={{ width: '100%', height: screenHeight * 0.45 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
        <View className="flex-row justify-between">
          <Pressable onPress={() => navigation.goBack()} className="flex-1 justify-between items-start p-10 px-5">
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>

          <Pressable onPress={() => console.log('Download pressed')} className="flex-1 justify-between items-end p-10 px-5">
            <Ionicons name="cloud-download" size={30} color="white" />
          </Pressable>
          </View>
        </View>


        <View className="absolute bottom-6 left-4">
          <Text className="text-pink-500 font-bold mb-1">En curso</Text>
          <Text className="text-white text-2xl font-bold">
            {manga.attributes.title.en ?? manga.attributes.altTitles?.find((t) => t.en)?.en}
          </Text>
          {manga.relationships?.find((rel) => rel.type === 'author') && (
            <Text className="text-white opacity-80 text-sm italic">
              By: {authorName ?? 'Unknown'}
            </Text>
          )}
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy
        swipeEnabled={true}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'deeppink' }}
            style={{ backgroundColor: 'white' }}
            activeColor="black"
            inactiveColor="gray"
          />
        )}
      />

      <Pressable className="bg-pink-500 mx-6 my-4 py-3 rounded-full">
        <Text className="text-white text-center font-bold">Seguir Leyendo</Text>
      </Pressable>
    </View>
  );
}
