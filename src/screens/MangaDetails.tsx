import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { TabView, TabBar } from 'react-native-tab-view';
import { getAuthorManga, getChaptersByMangaId } from '../services/mangadexApi';
import ChaptersTab from '../components/ChaptersTab';
import { Ionicons } from '@expo/vector-icons';
import { getApiLanguage } from '../utils/getApiLang';
import { isMangaSaved, removeManga, saveManga } from '../services/favorites';
import { deleteManga, downloadManga, isMangaDownloaded } from '../utils/downloadManga';
import DownloadFullIcon from '../assets/components/DownloadFullIcon';

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
  const [reverseOrder, setReverseOrder] = useState(false);

  const [routes] = useState([
    { key: 'general', title: 'General' },
    { key: 'chapters', title: 'Chapters' },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lang, setLang] = useState('en');
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const result = await isMangaSaved(manga.id);
      setIsSaved(result);
    };
    checkSaved();
  }, []);

  useEffect(() => {
    const load = async () => {
      const l = await getApiLanguage();
      setLang(l);
    };
    load();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: index === 1 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const fetchChapters = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getChaptersByMangaId(manga.id, 20, offset, reverseOrder ? 'desc' : 'asc');
      let newChapters = response.data ?? [];
      setChapters((prev) => [...prev, ...newChapters]);
      setOffset((prev) => prev + 20);
      setHasMore(newChapters.length === 20);
    } catch (err) {
      console.error('Fetch chapters error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = () => {
    setReverseOrder((prev) => !prev);
    setOffset(0);
    setChapters([]);
  };

  useEffect(() => {
  const checkDownload = async () => {
    const totalChapterIds = chapters?.map((c) => c.id);
    const result = await isMangaDownloaded(manga.id, totalChapterIds);
    setIsDownloaded(result);
  };

    checkDownload();
  }, [manga, chapters]);

  const opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const getAuthorName = async () => {
    try {
      const author = manga.relationships?.find((rel: any) => rel.type === 'author');
      if (author) {
        const authorName = await getAuthorManga(author.id);
        setAuthorName(authorName?.attributes?.name);
      }
    } catch (error) {
      console.error('Error fetching author name:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
    getAuthorName();
  }, [reverseOrder]);

  const GeneralRoute = () => (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
        {manga.attributes.description[lang] ?? 'No description available.'}
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

          <Pressable   onPress={async () => {
              if (isDownloading) return;

              if (isDownloaded) {
                await deleteManga(manga.id);
                setIsDownloaded(false);
              } else {
                setIsDownloading(true);
                await downloadManga(manga.id, chapters);
                setIsDownloaded(true);
                setIsDownloading(false);
              }
            }}
          disabled={isDownloading} 
          className="flex-1 justify-between items-end p-10 px-5" 
          style={{
            opacity: isDownloading ? 0.6 : 1,
            pointerEvents: isDownloading ? 'none' : 'auto',
          }}>
            {isDownloading ? (
                <ActivityIndicator size="small" color="#FF3E91" />
              ) : (
                <DownloadFullIcon downloaded={isDownloaded} />
              )}
          </Pressable>
          </View>
        </View>

        {(() => {
            let statusBgColor = '', statusTextColor = '', statusLabel = '';
            switch (manga?.attributes?.status) {
              case 'completed':
                statusBgColor = 'bg-green-500';
                statusTextColor = 'text-white';
                statusLabel = 'Completed';
                break;
              case 'ongoing':
                statusBgColor = 'bg-pink-500';
                statusTextColor = 'text-white';
                statusLabel = 'On Going';
                break;
              case 'hiatus':
                statusBgColor = 'bg-yellow-400';
                statusTextColor = 'text-black';
                statusLabel = 'Hiatus';
                break;
              case 'cancelled':
                statusBgColor = 'bg-red-500';
                statusTextColor = 'text-white';
                statusLabel = 'Cancelled';
                break;
              default:
                statusBgColor = 'bg-gray-500';
                statusTextColor = 'text-white';
                statusLabel = manga?.attributes?.status ?? 'Desconocido';
            }
          return (
            <View className="absolute bottom-6 left-4">
              <View className={`self-start rounded-full px-3 py-1 ${statusBgColor}`}>
                <Text className={`font-bold text-sm ${statusTextColor}`}>
                  {statusLabel}
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold">
                {manga.attributes.title.en ?? manga.attributes.altTitles?.find((t) => t.en)?.en}
              </Text>
              {manga.relationships?.find((rel) => rel.type === 'author') && (
                <Text className="text-white opacity-80 text-sm italic">
                  By: {authorName ?? 'Unknown'}
                </Text>
              )}
            </View>
          );
        })()}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        lazy
        swipeEnabled={true}
        renderTabBar={(props) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              borderBottomWidth: 0.5,
              borderBottomColor: '#eee',
              paddingHorizontal: 10,
            }}
          >
            <TabBar
              {...props}
              style={{
                backgroundColor: '#fff',
                elevation: 0,
                flex: 1,
              }}
              indicatorStyle={{
                backgroundColor: '#FF3E91',
                height: 3,
                borderRadius: 4,
              }}
              activeColor="#000"
              inactiveColor="#999"
              pressColor="#f0f0f0"
              tabStyle={{ width: 'auto', paddingHorizontal: 16 }}
              scrollEnabled={false}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Animated.View style={{ opacity }}>
                {index === 1 && (
                  <Pressable onPress={toggleOrder}>
                    <Ionicons name="swap-vertical" size={20} color={reverseOrder ? '#FF3E91' : 'gray'}  />
                  </Pressable>
                )}
              </Animated.View>
              <Pressable onPress={async () => {
                  if (isSaved) {
                    await removeManga(manga.id);
                  } else {
                    await saveManga(manga);
                  }
                  setIsSaved(!isSaved);
                }}>
                <Ionicons name="bookmark" size={20} color={isSaved ? '#FF3E91' : 'gray'} />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable className="bg-pink-500 mx-6 my-4 py-3 rounded-full">
        <Text className="text-white text-center font-bold">Seguir Leyendo</Text>
      </Pressable>
    </View>
  );
}
