import { View, Text } from 'react-native';
import React, { useState } from 'react';
import MangaList from '../components/MangaList';
import Navbar from '../components/Navbar';

export default function HomeScreen() {
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <View>
      <Navbar
        onSearch={() => console.log('Search pressed')}
        onFilter={() => console.log('Filter pressed')}
        onReload={() => setReloadFlag((prev) => !prev)}
      />
      <MangaList key={reloadFlag.toString()} />
    </View>
  );
}
