import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getContinueReading } from '../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavbarContinueReading from '../components/NavbarContinueReading';

export default function ContinueReadingList() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();

  const filteredMangas = mangas.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    const newHistory = mangas.filter((item) => !selected.includes(item.mangaId));
    await AsyncStorage.setItem('continue_reading', JSON.stringify(newHistory));
    setMangas(newHistory);
    setSelected([]);
    setIsEditing(false);
  };

  const handleActivateEditing = () => {
    setIsEditing(true);
    setSelected(filteredMangas.map((item) => item.mangaId));
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setSelected([]);
  };


  useEffect(() => {
    const load = async () => {
      const data = await getContinueReading();
      setMangas(data);
    };
    load();
  }, []);

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
    return <ActivityIndicator className="mt-10"/>;
  }

  return (
    <View className='flex-1 bg-white dark:bg-gray-900'>
        <NavbarContinueReading
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isEditing={isEditing}
            setIsEditing={handleActivateEditing}
            onDeleteSelected={handleDeleteSelected}
            selectedCount={selected.length}
            onCancelEditing={handleCancelEditing}
          />
          <View className="bg-white dark:bg-gray-900 p-4 pr-1">
          <Text className="text-2xl font-bold mb-4 dark:text-white">Continue Reading</Text>
        <FlatList
          data={filteredMangas}
          keyExtractor={(item, index) => `${item.mangaId}-${index}`}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.mangaId);
            return (
              <Pressable
                onPress={() =>
                  isEditing
                    ? toggleSelect(item.mangaId)
                    : navigation.navigate('ChapterReader', {
                        chapterId: item.lastReadChapterId,
                        mangaId: item.mangaId,
                      })
                }
                className={`mb-4 flex-row items-center ${
                  isSelected ? 'bg-pink-100 dark:bg-pink-900' : ''
                }`}
              >
                <Image
                  source={{ uri: getCoverUrl(item) }}
                  style={{
                    width: 100,
                    height: 150,
                    borderRadius: 8,
                    marginRight: 12,
                    opacity: isSelected ? 0.5 : 1,
                  }}
                />
                <View className="flex-1 justify-center">
                  <Text className="text-base font-bold dark:text-white" numberOfLines={1}>
                    {item.title ?? 'Sin título'}
                  </Text>
                  <Text className="text-sm text-gray-400 mb-1">Capítulo {item.chapter}</Text>
                  {isEditing ? (
                    <Text className="text-xs text-red-500">Tap to {isSelected ? 'unselect' : 'select'}</Text>
                  ) : (
                    <Text className="text-xs text-pink-500">Toque para continuar</Text>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
        </View>
    </View>

  );
}
