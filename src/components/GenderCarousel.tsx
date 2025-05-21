// components/GenreCarousel.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ImageBackground, ActivityIndicator } from 'react-native';
import { getAllTags } from '../services/mangadexApi';

interface GenreTag {
  id: string;
  attributes: {
    name: Record<string, string>;
    group: string;
  };
}

interface GenreCarouselProps {
  onSelectGenre: (genreId: string) => void;
}

export default function GenreCarousel({ onSelectGenre }: Readonly<GenreCarouselProps>) {
  const [genres, setGenres] = useState<GenreTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const allTags: GenreTag[] = await getAllTags();
        const genreTags = allTags.filter((tag) => tag.attributes.group === 'genre');
        setGenres(genreTags);
      } catch (e) {
        console.error('Error fetching genre tags', e);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" className="my-4" />;
  }

  return (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-2">Genres</Text>
      <FlatList
        horizontal
        data={genres}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelectGenre(item.id)}
            className="mr-4"
          >
            <ImageBackground
                source={{
                    uri: `https://uploads.mangadex.org/tags/${item.id}.jpg`,
                }}
              style={{ width: 120, height: 80, borderRadius: 12, overflow: 'hidden' }}
              imageStyle={{ borderRadius: 12 }}
            >
              <View className="flex-1 bg-black/50 justify-center items-center">
                <Text className="text-white font-bold text-center">
                  {item.attributes.name.en?.toUpperCase() ?? 'UNKNOWN'}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
}
