
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChapterReaderControlsProps {
  currentPage: number;
  totalPages: number;
  onClose: () => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onSave: () => void;
  manga: any;
}

export default function ChapterReaderControls({
  currentPage,
  totalPages,
  onClose,
  onNextChapter,
  onPrevChapter,
  onSave,
  manga,
}: Readonly<ChapterReaderControlsProps>) {
  return (
    <>
      <View className=" absolute top-0 inset-x-0 bg-black/30 px-4 pt-12 pb-3 flex-row justify-between items-center z-10">
        <Pressable onPress={onClose}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </Pressable>

        <View className="flex-1 mx-4">
          <Text className="text-white font-bold text-sm text-center" numberOfLines={1}>
            {manga?.attributes?.title?.en ??
              manga?.attributes?.altTitles?.find((t) => t.en)?.en ??
              'Sin título'}
          </Text>
          <Text className="text-white text-xs text-center">Chapter {currentPage + 1}</Text>
        </View>

        <Pressable onPress={onSave}>
          <Ionicons name="bookmark-outline" size={24} color="white" />
        </Pressable>
      </View>

      {/* Footer - barra de navegación + progreso */}
      <View className="absolute bottom-6 inset-x-0 px-6 z-10">
        <View className="flex-row justify-between items-center mb-2">
          <Pressable onPress={onPrevChapter}>
            <Ionicons name="arrow-back-circle" size={34} color="white" />
          </Pressable>

          <Text className="text-white text-xs">
            Página {currentPage + 1} de {totalPages}
          </Text>

          <Pressable onPress={onNextChapter}>
            <Ionicons name="arrow-forward-circle" size={34} color="white" />
          </Pressable>
        </View>

        <View className="h-1 bg-gray-700 rounded">
          <View
            className="h-1 bg-pink-500 rounded"
            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
          />
        </View>
      </View>
    </>
  );
}
