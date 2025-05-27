import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDownloadedMangas } from './src/store/useDownloadedMangas';

export default function App() {
  useEffect(() => {
    useDownloadedMangas.getState().loadDownloaded();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
