// components/DarkModeToggle.tsx
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import MSwitch from './MSwitch';
import { Ionicons } from '@expo/vector-icons';

export default function DarkModeToggle() {
  const { colorScheme, setColorScheme, toggleColorScheme  } = useColorScheme();

    const handleToggle = useCallback(() => {
      try {
        toggleColorScheme();
      } catch (error) {
        console.warn('Error al cambiar el tema:', error);
        const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
        setColorScheme(newScheme);
      }
    }, [colorScheme, toggleColorScheme, setColorScheme]);

  return (
    <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center space-x-2">
            <Ionicons name={colorScheme === 'dark' ? 'moon-outline' : 'sunny-outline'} size={20} color="#ec4899" />
            <Text className="text-base font-medium  dark:text-white">{colorScheme === 'dark' ? 'Ligth Mode' : 'Dark Mode'}</Text>
        </View>
      <MSwitch value={colorScheme === 'dark'} onValueChange={handleToggle} />
    </View>
  );
}