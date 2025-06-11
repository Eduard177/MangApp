import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getContinueReading } from '../services/storage';
import Navbar from '../components/Navbar';

export default function ContinueReadingList() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const data = await getContinueReading();
      setMangas(data);
      setLoading(false);
    };
    load();
  }, []);

  const getCoverUrl = (item: any) => {
    return item.cover ? `https://uploads.mangadex.org/covers/${item.mangaId}/${item.cover}.256.jpg` : null;
  };

  if (loading) {
    return <ActivityIndicator className="mt-10" />;
  }

  return (
    <View className='flex-1 bg-white dark:bg-gray-900'>
        <Navbar canSearch={false}/>
        <View className="bg-white dark:bg-gray-900 p-4">
        <Text className="text-2xl font-bold mb-4 dark:text-white">Continue Reading</Text>
        <FlatList
            data={mangas}
            keyExtractor={(item, index) => `${item.mangaId}-${index}`}
            renderItem={({ item }) => (
            <Pressable
                onPress={() =>
                navigation.navigate('ChapterReader', {
                    chapterId: item.lastReadChapterId,
                    mangaId: item.mangaId,
                })
                }
                className="mb-4 flex-row"
            >
                <Image
                source={{ uri: getCoverUrl(item) }}
                style={{ width: 100, height: 150, borderRadius: 8, marginRight: 12 }}
                />
                <View className="flex-1 justify-center">
                <Text className="text-base font-bold dark:text-white" numberOfLines={1}>
                    {item.title ?? 'Sin título'}
                </Text>
                <Text className="text-sm text-gray-400 mb-1">Capítulo {item.chapter}</Text>
                <Text className="text-xs text-pink-500">Toque para continuar</Text>
                </View>
            </Pressable>
            )}
        />
        </View>
    </View>

  );
}
