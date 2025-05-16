import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MangaDetailScreen from '../screens/MangaDetails';
import ChapterReaderScreen from '../screens/ChapterReaderScreen';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MangaDetails" component={MangaDetailScreen} />
      <Stack.Screen
        name="ChapterReader"
        component={ChapterReaderScreen}
        options={{ title: 'Readding...' }}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}
