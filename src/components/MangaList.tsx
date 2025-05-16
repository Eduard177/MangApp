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
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={mangas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4 flex-row items-center space-x-4">
              <Image
                source={{ uri: getCoverUrl(item) }}
                style={{ width: 70, height: 100, borderRadius: 6 }}
              />
              <Text className="text-lg font-semibold flex-1">
                {item.attributes.title.en || 'Sin título'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
