import React, { forwardRef, useEffect, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguageStore } from '../store/useLanguageStore';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Español (LatAm)', value: 'es-la' },
];

const LanguageModal = forwardRef<Modalize>((_, ref) => {
  const [selected, setSelected] = useState('en');
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('apiLanguage');
      if (saved) {
        setSelected(saved);
        setLanguage(saved);
      }
    };
    load();
  }, []);

  const select = async (value: string) => {
    setSelected(value);
    await AsyncStorage.setItem('apiLanguage', value);
    setLanguage(value);
  };

  return (
    <Modalize ref={ref} adjustToContentHeight>
      <View className="p-4 dark:bg-gray-700">
        <Text className="text-base font-bold mb-4">Idioma preferido</Text>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.value}
            onPress={() => select(lang.value)}
            className={`flex-row items-center justify-between px-4 py-2 rounded-md mb-2 border  ${
              selected === lang.value ? 'border-pink-500 bg-pink-50 dark:bg-gray-700' : 'border-gray-300'
            }`}
          >
            <Text className="text-sm dark:text-white">{lang.label}</Text>
            {selected === lang.value && (
              <Text className="text-pink-500 font-semibold">✓</Text>
            )}
          </Pressable>
        ))}
      </View>
    </Modalize>
  );
});

export default LanguageModal;
