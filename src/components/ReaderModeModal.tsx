import React, { forwardRef, useEffect, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReaderMode, useReaderModeStore } from '../store/useReaderModeStore';

const MODES = [
  { label: 'Vertical Scroll', value: 'vertical' },
  { label: 'Manga (Right to Left)', value: 'horizontal-rtl' },
  { label: 'Comic (Left to Right)', value: 'horizontal-ltr' },
];

const STORAGE_KEY = 'readerMode';

const ReaderModeModal = forwardRef<Modalize>((_, ref) => {
  const { mode, setMode } = useReaderModeStore();
  const [selected, setSelected] = useState<ReaderMode>('vertical');

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'vertical' || saved === 'horizontal-rtl' || saved === 'horizontal-ltr') {
        setSelected(saved);
        setMode(saved);
      } else {
        setSelected(mode);
      }
    };
    load();
  }, []);

  const select = async (value: ReaderMode) => {
    setSelected(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
    setMode(value);
    // @ts-ignore
    ref?.current?.close();
  };

  return (
    <Modalize ref={ref} adjustToContentHeight>
      <View className="p-4 dark:bg-gray-700">
        <Text className="text-base font-bold mb-4 dark:text-white">Reading Mode</Text>
        {MODES.map((modeOption) => (
          <Pressable
            key={modeOption.value}
            onPress={() => select(modeOption.value as ReaderMode)}
            className={`flex-row items-center justify-between px-4 py-2 rounded-md mb-2 border ${
              selected === modeOption.value
                ? 'border-pink-500 bg-pink-50 dark:bg-gray-700'
                : 'border-gray-300 dark:border-gray-500'
            }`}
          >
            <Text className="text-sm dark:text-white">{modeOption.label}</Text>
            {selected === modeOption.value && (
              <Text className="text-pink-500 font-semibold">✓</Text>
            )}
          </Pressable>
        ))}
      </View>
    </Modalize>
  );
});

export default ReaderModeModal;
