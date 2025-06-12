import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { fetchAllChapters, getAuthorManga, getChaptersByMangaId } from '../services/mangadexApi';
import ChaptersTab from '../components/ChaptersTab';
import { Ionicons } from '@expo/vector-icons';
import { getApiLanguage } from '../utils/getApiLang';
import { isMangaSaved, removeManga, saveManga } from '../services/favorites';
import { deleteManga, downloadManga, isMangaDownloaded } from '../utils/downloadManga';
import DownloadFullIcon from '../assets/components/DownloadFullIcon';
import { useColorScheme } from 'nativewind';
import { queueDownload } from '../services/backgroundDownloadMangaer';
import Toast from 'react-native-toast-message';
import { getReadChapters } from '../utils/readHistory';

const screenHeight = Dimensions.get('window').height;

type RootStackParamList = {
  MangaDetails: { manga: any };
  ChapterReader: { chapterId: string; mangaId: string };
};

export default function MangaDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'MangaDetails'>>();
  const rawManga = route.params.manga;
  const manga = useMemo(() => JSON.parse(JSON.stringify(rawManga)), [rawManga]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<'general' | 'chapters'>('general');
  const [chapters, setChapters] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [reverseOrder, setReverseOrder] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lang, setLang] = useState('en');
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { colorScheme } = useColorScheme();
  const [readChaptersForThisManga, setReadChaptersForThisManga] = useState<string[]>([]);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [continueButtonText, setContinueButtonText] = useState('Empezar a leer');
  const [targetChapterId, setTargetChapterId] = useState<string | null>(null);
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: activeTab === 'chapters' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  useEffect(() => {
    (async () => {
      const l = await getApiLanguage();
      setLang(l);
      const result = await isMangaSaved(manga.id);
      setIsSaved(result);
    })();
  }, []);

  useEffect(() => {
    const checkDownload = async () => {
      const totalChapterIds = chapters?.map((c) => c.id);
      const result = await isMangaDownloaded(manga.id, totalChapterIds);
      setIsDownloaded(result);
    };
    checkDownload();
  }, [manga, chapters, refreshKey]);

  useEffect(() => {
    const evaluateReadingStatus = async () => {
      const allChapterIds = chapters.map((c) => c.id);
      const readChapters = await getReadChapters();
      const readForThisManga = allChapterIds.filter((id) => readChapters.includes(id));

      setReadChaptersForThisManga(readForThisManga);

      if (readForThisManga.length === 0 && allChapterIds.length > 0) {
        setTargetChapterId(allChapterIds[0]);
        setContinueButtonText('Empezar a leer');
        setShowContinueButton(true);
      } else if (readForThisManga.length > 0 && readForThisManga.length < allChapterIds.length) {
        const lastRead = readForThisManga[readForThisManga.length - 1];
        setTargetChapterId(lastRead);
        setContinueButtonText('Seguir leyendo');
        setShowContinueButton(true);
      } else {
        setShowContinueButton(false);
      }
    };

    if (chapters.length > 0) {
      evaluateReadingStatus();
    }
  }, [chapters]);


  const handleDownloadAllChapters = async () => {
    setIsDownloadingAll(true);
    const allChapters = await fetchAllChapters(manga.id);

    Toast.show({
      type: 'info',
      text1: 'Iniciando descarga...',
      text2: `Total capítulos: ${allChapters.length}`,
      visibilityTime: 1500,
      autoHide: false,
    });

    queueDownload(async () => {
      await downloadManga(manga.id, allChapters, (completed) => {
        Toast.show({
          type: 'info',
          text1: 'Descargando...',
          text2: `Capítulo ${completed}/${allChapters.length}`,
          autoHide: false,
          visibilityTime: 1500,
        });
      });
    });

    setIsDownloadingAll(false);
  };

  const fetchChapters = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getChaptersByMangaId(manga.id, 20, offset, reverseOrder ? 'desc' : 'asc');
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

  const toggleOrder = () => {
    setReverseOrder((prev) => !prev);
    setOffset(0);
    setChapters([]);
  };

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
    <ScrollView className="flex-1 dark:bg-gray-800" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
        {manga.attributes.description[lang] ?? 'No description available.'}
      </Text>
      <Text className="font-semibold mb-1 dark:text-gray-400">Genres:</Text>
      <Text className="text-sm text-gray-600 dark:text-gray-200">
        {manga.attributes.tags
          ?.map((tag: { attributes: { name: { en: any } } }) => tag.attributes.name.en)
          .join(', ') ?? 'Unknown'}
      </Text>
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-800">
      <View className="relative">
        <Image
          source={{
            uri: `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships?.find((r) => r.type === 'cover_art')?.attributes.fileName}.256.jpg`,
          }}
          style={{ width: '100%', height: screenHeight * 0.45 }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View className="flex-row justify-between">
            <Pressable onPress={() => navigation.goBack()} className="flex-1 justify-between items-start p-10 px-5">
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Pressable
              onPress={async () => {
                if (isDownloadingAll) return;
                if (isDownloaded) {
                  await deleteManga(manga.id);
                  setRefreshKey((prev) => prev + 1);
                  setIsDownloadingAll(false);
                } else {
                  setIsDownloadingAll(true);
                  await handleDownloadAllChapters();
                  setRefreshKey((prev) => prev + 1);
                  setIsDownloaded(true);
                  setIsDownloadingAll(false);
                }
              }}
              disabled={isDownloadingAll}
              className="flex-1 justify-between items-end p-10 px-5"
              style={{
                opacity: isDownloadingAll ? 0.6 : 1,
                pointerEvents: isDownloadingAll ? 'none' : 'auto',
              }}
            >
              {isDownloadingAll ? (
                <ActivityIndicator size="small" color="#FF3E91" />
              ) : (
                <DownloadFullIcon downloaded={isDownloaded} />
              )}
            </Pressable>
          </View>
        </View>

        <View className="absolute bottom-6 left-4">
          {(() => {
            let statusClass = 'bg-gray-500';
            if (manga.attributes.status === 'completed') {
              statusClass = 'bg-green-500';
            } else if (manga.attributes.status === 'ongoing') {
              statusClass = 'bg-pink-500';
            } else if (manga.attributes.status === 'hiatus') {
              statusClass = 'bg-yellow-400';
            } else if (manga.attributes.status === 'cancelled') {
              statusClass = 'bg-red-700';
            }
            return (
              <View className={`self-start rounded-full px-3 py-1 ${statusClass}`}>
                <Text className="font-bold text-sm text-white">
                  {manga.attributes.status ?? 'Unknown'}
                </Text>
              </View>
            );
          })()}
          <Text className="text-white text-2xl font-bold">
            {manga.attributes.title.en ?? manga.attributes.altTitles?.find((t) => t.en)?.en}
          </Text>
          {!!authorName && (
            <Text className="text-white opacity-80 text-sm italic">
              By: {authorName}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row border-b border-b-[#eee] px-2.5 bg-white dark:bg-gray-800">
        {['general', 'chapters'].map((tabKey) => (
          <Pressable
            key={tabKey}
            onPress={() => setActiveTab(tabKey as 'general' | 'chapters')}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: activeTab === tabKey ? 3 : 0,
              borderBottomColor: '#FF3E91',
            }}
          >
            <Text style={{
              color: activeTab === tabKey ? (isDark ? '#fff' : '#1f2937') : '#999',
              fontWeight: activeTab === tabKey ? 'bold' : 'normal',
            }}>
              {tabKey === 'general' ? 'General' : 'Chapters'}
            </Text>
          </Pressable>
        ))}

        <View className="flex flex-row items-center gap-3 ml-auto">
          <Animated.View style={{ opacity: fadeAnim }}>
            {activeTab === 'chapters' && (
              <Pressable onPress={toggleOrder}>
                <Ionicons name="swap-vertical" size={20} color={reverseOrder ? '#FF3E91' : 'gray'} />
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

      {activeTab === 'general' ? (
        <GeneralRoute />
      ) : (
        <ChaptersTab
          chapters={chapters}
          loading={loading}
          fetchChapters={fetchChapters}
          mangaId={manga.id}
          navigation={navigation}
        />
      )}

      {showContinueButton && !!targetChapterId && (
        <Pressable
          className="bg-pink-500 mx-6 my-4 py-3 rounded-full"
          onPress={() => {
            navigation.navigate('ChapterReader', {
              chapterId: targetChapterId,
              mangaId: manga.id,
            });
          }}
        >
          <Text className="text-white text-center font-bold">{continueButtonText}</Text>
        </Pressable>
      )}
    </View>
  );
}
