import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import MSwitch from './MSwitch';
import { Ionicons } from '@expo/vector-icons';

export default function DarkModeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleToggle = useCallback(() => {
    try {
      setTimeout(() => {
        toggleColorScheme();
      }, 10);
    } catch (error) {
      console.warn('Error al cambiar el tema:', error);
    }
  }, [colorScheme, toggleColorScheme]);

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