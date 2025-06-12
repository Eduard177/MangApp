import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import MSwitch from './MSwitch';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DarkModeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

const handleToggle = useCallback(async () => {
  try {
    const newScheme = isDark ? 'light' : 'dark';
    await AsyncStorage.setItem('theme', newScheme);
    toggleColorScheme();
  } catch (error) {
    console.warn('Error al cambiar el tema:', error);
  }
}, [isDark, toggleColorScheme]);

  return (
    <View className="flex-row items-center justify-between ">
      <View className="flex-row items-center space-x-2">
        <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={20} color="#ec4899" />
        <Text className="text-base font-medium  dark:text-white">{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
      </View>
      <MSwitch value={isDark} onValueChange={handleToggle} />
    </View>
  );
}