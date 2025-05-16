// src/screens/SearchScreen.tsx
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { searchManga } from '../services/mangadexApi';

export default function SearchScreen() {
  useEffect(() => {
    const fetchManga = async () => {
      const data = await searchManga('One Piece');
      console.log(data);
    };
    fetchManga();
  }, []);

  return (
    <View>
      <Text>Buscando mangas...</Text>
    </View>
  );
}
