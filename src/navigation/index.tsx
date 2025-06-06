import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import MangaDetailScreen from '../screens/MangaDetails';
import ChapterReaderScreen from '../screens/ChapterReaderScreen';
import SettingsScreen from '../screens/SettingScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import MangaListScreen from '../screens/MangaListScreen';

export type RootStackParamList = {
  Home: undefined;
  ExploreScreen: undefined;
  MangaDetails: undefined;
  ChapterReader: undefined;
  SearchScreen: undefined;
  SettingScreen: undefined;
  MangaListScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen}  options={{ animation: 'fade', animationDuration: 300}}/>
      <Stack.Screen name='ExploreScreen' component={ExploreScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false}} />
      <Stack.Screen name="MangaDetails" component={MangaDetailScreen}  options={{ animation: 'fade_from_bottom', animationDuration: 400}}  />
      <Stack.Screen
        name="ChapterReader"
        component={ChapterReaderScreen}
        options={{ title: 'Readding...', animation: 'fade'}}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ animation: 'none'}}  />
      <Stack.Screen name="MangaListScreen" component={MangaListScreen} options={{ title: 'Todos los mangas' }} />
      <Stack.Screen name="SettingScreen" component={SettingsScreen} options={{ animation: 'fade', animationDuration: 300, gestureEnabled: false}}  />
    </Stack.Navigator>
  );
}
