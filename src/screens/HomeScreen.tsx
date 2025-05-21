import { View, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchMangaGender, fetchPopularMangas } from '../services/mangaService';
import MangaCarousel from '../components/MangaCarousel';
import { useFocusEffect } from '@react-navigation/native';
import { getReadingHistory } from '../services/storage';
import { transformHistoryToMangaData } from '../utils/transformHistoryToMangaData.util';
import MainBar from '../components/MainBar';
import GenreCarousel from '../components/GenderCarousel';

export default function HomeScreen() {
  const [reloadFlag, setReloadFlag] = useState(true);

  // const [recentChapters, setRecentChapters] = useState([]);

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchHistory = async () => {
  //       const history = await getReadingHistory();
  //       setRecentChapters(history);
  //     };
  //     fetchHistory();
  //   }, []),
  // );
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => console.log('Filter pressed')}
        onReload={() => setReloadFlag((prev) => !prev)}
      />
      <ScrollView className="p-4">
        {/* {recentChapters.length > 0 && (
          <MangaCarousel
            title="Continued Reading"
            fetchFunction={() => transformHistoryToMangaData(recentChapters)}
          />
        )} */}
        <MangaCarousel title="Popular" fetchFunction={(limit, offset) => fetchPopularMangas(limit, offset)} />

        <GenreCarousel onSelectGenre={(id) => console.log('Género seleccionado:', id)} />

        <MangaCarousel title="Popular" fetchFunction={() => fetchPopularMangas()} />

      </ScrollView>
            <MainBar/>
    </View>
  );
}
