import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { getPopularManga } from '../services/mangadexApi';

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMangas = async () => {
    try {
      setLoading(true);
      const data = await getPopularManga(10, 0);
      setMangas(data.data);
    } catch (error) {
      console.error('Error fetching mangas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangas();
  }, []);

  const getCoverUrl = (manga: any) => {
    const fileName = manga?.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes
      ?.fileName;
    return fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : null;
  };

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-2">Popular Manga</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={mangas}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mr-4" style={{ width: 120 }}>
              <Image
                source={{ uri: getCoverUrl(item) }}
                style={{ width: '100%', height: 150, borderRadius: 8 }}
                resizeMode="cover"
              />
              <Text className="text-base font-semibold mt-2" numberOfLines={2} ellipsizeMode="tail">
                {item.attributes.title.en ?? item.attributes.title.esla ?? 'Sin título'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
