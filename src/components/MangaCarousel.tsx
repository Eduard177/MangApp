import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface MangaCarouselProps {
  title: string;
  fetchFunction: () => Promise<any[]>;
}

const getCoverUrl = (manga: any) => {
  const fileName = manga?.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes
    ?.fileName;
  return fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : null;
};

export default function MangaCarousel({ title, fetchFunction }: MangaCarouselProps) {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadMangas = async () => {
    try {
      setLoading(true);
      const data = await fetchFunction();
      setMangas(data);
    } catch (error) {
      console.error(`Error fetching ${title} mangas:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMangas();
  }, []);

  return (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <FlatList
          horizontal
          data={mangas}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('MangaDetails', { manga: item })}
              className="mr-4"
            >
              <Image
                source={{ uri: getCoverUrl(item) }}
                style={{ width: 120, height: 180, borderRadius: 8 }}
              />
              <Text className="mt-1 w-28 text-sm font-medium text-center">
                {item.attributes.title.en ?? 'Sin título'}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
