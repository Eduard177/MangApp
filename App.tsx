import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" translucent={false} backgroundColor="#ffffff" />
      <Navigation />
    </NavigationContainer>
  );
}
