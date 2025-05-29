// components/DarkModeToggle.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import MSwitch from './MSwitch';
import { Ionicons } from '@expo/vector-icons';

export default function DarkModeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center space-x-2">
            <Ionicons name={colorScheme === 'dark' ? 'moon-outline' : 'sunny-outline'} size={20} color="#ec4899" />
            <Text className="text-base font-medium  dark:text-white">Mod Incognito</Text>
        </View>
      <MSwitch value={colorScheme === 'dark'} onValueChange={toggleTheme} />
    </View>
  );
}