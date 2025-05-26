import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSavedMangas } from '../services/favorites';

interface Props {
  numColumns?: number;
}

export default function SavedMangasGrid({ numColumns = 3 }: Readonly<Props>) {
  const [savedMangas, setSavedMangas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      const data = await getSavedMangas();
      setSavedMangas(data);
    };
    load();
  }, []);

  const itemWidth = Dimensions.get('window').width / numColumns - 16;

  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() =>
        navigation.navigate('MangaDetails', { manga: item.manga })
      }
      className="mb-4"
      style={{ width: itemWidth, marginHorizontal: 4 }}
    >
      <Image
        source={{ uri: `https://uploads.mangadex.org/covers/${item.manga.id}/${item.cover}.256.jpg` }}
        style={{ width: '100%', height: itemWidth * 1.5, borderRadius: 8 }}
      />
      <Text className="mt-1 text-sm font-medium text-left text-black dark:text-white" numberOfLines={1}>
        {item.title ?? 'Sin título'}
      </Text>
    </Pressable>
  );

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold mb-2">Saved</Text>
      <FlatList
        data={savedMangas}
        key={numColumns}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.manga.id}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
}
