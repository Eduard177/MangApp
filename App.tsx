import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
