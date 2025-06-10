import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDownloadedMangas } from './src/store/useDownloadedMangas';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { IncognitoProvider } from './src/context/incognito-context';

export default function App() {
  useEffect(() => {
    useDownloadedMangas.getState().loadDownloaded();
  }, []);
    const {colorScheme} = useColorScheme();
    const isDark = colorScheme === 'dark';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IncognitoProvider>
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} translucent={false} backgroundColor="#ffffff" />
          <Navigation />
        </NavigationContainer>
        <Toast />
      </IncognitoProvider>

    </GestureHandlerRootView>
  );
}
