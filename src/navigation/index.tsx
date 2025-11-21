import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchScreen from '../screens/SearchScreen';
import MangaDetailScreen from '../screens/MangaDetails';
import ChapterReaderScreen from '../screens/ChapterReaderScreen';
import SettingsScreen from '../screens/SettingScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import MangaListScreen from '../screens/MangaListScreen';
import ContinueReadingList from '../screens/ContinueReadingList';
import MainBar from '../components/MainBar';

export type RootStackParamList = {
  Root: undefined;
  MangaDetails: undefined;
  ChapterReader: undefined;
  SearchScreen: undefined;
  MangaListScreen: undefined;
  ContinueReadingList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <MainBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ExploreScreen" component={ExploreScreen} />
      <Tab.Screen name="SettingScreen" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={TabNavigator} options={{ animation: 'fade', animationDuration: 300}}/>
      <Stack.Screen name="MangaDetails" component={MangaDetailScreen}  options={{ animation: 'fade_from_bottom', animationDuration: 400}}  />
      <Stack.Screen
        name="ChapterReader"
        component={ChapterReaderScreen}
        options={{ title: 'Readding...', animation: 'fade'}}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ animation: 'none'}}  />
      <Stack.Screen name="MangaListScreen" component={MangaListScreen} options={{ animation: 'fade', animationDuration: 300 }} />
      <Stack.Screen name="ContinueReadingList" component={ContinueReadingList} options={{ animation: 'fade', animationDuration: 300}} />
    </Stack.Navigator>
  );
}
