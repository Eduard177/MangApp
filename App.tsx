import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDownloadedMangas } from './src/store/useDownloadedMangas';
import Toast from 'react-native-toast-message';
import { IncognitoProvider } from './src/context/incognito-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    useDownloadedMangas.getState().loadDownloaded();

    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setColorScheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IncognitoProvider>
        <NavigationContainer>
          <StatusBar
            style={isDark ? 'light' : 'dark'}
            translucent={false}
            backgroundColor="#ffffff"
          />
          <Navigation />
        </NavigationContainer>
        <Toast />
      </IncognitoProvider>
    </GestureHandlerRootView>
  );
}
