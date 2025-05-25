import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import MangaDetailScreen from '../screens/MangaDetails';
import ChapterReaderScreen from '../screens/ChapterReaderScreen';
import SettingsScreen from '../screens/SettingScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import { useNavigationState } from '@react-navigation/native';
import MainBar from '../components/MainBar';
import { View } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  ExploreScreen: undefined;
  MangaDetails: undefined;
  ChapterReader: undefined;
  SearchScreen: undefined;
  SettingScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {

  const state = useNavigationState((state) => state);
  const currentRoute = state?.routes?.[state.index]?.name;

  // Define pantallas donde NO quieres que se vea
  const hideMainBarOnRoutes = ['ChapterReader', 'MangaDetails', 'SearchScreen'];

  const shouldShowMainBar = !hideMainBarOnRoutes.includes(currentRoute ?? '');
  return (
    <View className='flex-1'>
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name='ExploreScreen' component={ExploreScreen} />
      <Stack.Screen name="MangaDetails" component={MangaDetailScreen} />
      <Stack.Screen
        name="ChapterReader"
        component={ChapterReaderScreen}
        options={{ title: 'Readding...' }}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SettingScreen" component={SettingsScreen} />
    </Stack.Navigator>

        {shouldShowMainBar && <MainBar />}
    </View>

  );
}
