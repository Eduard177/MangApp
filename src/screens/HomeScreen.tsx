import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { fetchMangaGender, fetchPopularMangas } from '../services/mangaService';
import MangaCarousel from '../components/MangaCarousel';

export default function HomeScreen() {
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <View>
      <Navbar
        onSearch={() => console.log('Search pressed')}
        onFilter={() => console.log('Filter pressed')}
        onReload={() => setReloadFlag((prev) => !prev)}
      />
      <ScrollView className="p-4">
        <MangaCarousel title="Popular" fetchFunction={() => fetchPopularMangas()} />
        <MangaCarousel title="Gender" fetchFunction={() => fetchMangaGender()} />
      </ScrollView>
    </View>
  );
}
