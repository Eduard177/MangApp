import { View, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchMangaGender, fetchPopularMangas } from '../services/mangaService';
import MangaCarousel from '../components/MangaCarousel';
import { useFocusEffect } from '@react-navigation/native';
import { getReadingHistory } from '../services/storage';
import { transformHistoryToMangaData } from '../utils/transformHistoryToMangaData.util';

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
    <View>
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
        <MangaCarousel title="Popular" fetchFunction={() => fetchPopularMangas()} />
        <MangaCarousel title="Gender" fetchFunction={() => fetchMangaGender()} />
      </ScrollView>
    </View>
  );
}
