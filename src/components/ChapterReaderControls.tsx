
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isMangaSaved, removeManga, saveManga } from '../services/favorites';

interface ChapterReaderControlsProps {
  currentPage: number;
  totalPages: number;
  onClose: () => void;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  manga: any;
}

export default function ChapterReaderControls({
  currentPage,
  totalPages,
  onClose,
  onNextChapter,
  onPrevChapter,
  manga,
}: Readonly<ChapterReaderControlsProps>) {
    const [isSaved, setIsSaved] = useState<boolean>(false);
  

      useEffect(() => {
      const checkSaved = async () => {
        const saved = await isMangaSaved(manga.id);
        setIsSaved(saved);
      };
        checkSaved();
      }, [manga]);
  
      const handleSaveToggle = async () => {
        if (isSaved) {
          await removeManga(manga);
        } else {
          await saveManga(manga);
        }
        setIsSaved(!isSaved);
      };
    
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
          <Text className="text-white text-xs text-center">Page {currentPage + 1}</Text>
        </View>

        <Pressable onPress={handleSaveToggle}>
          <Ionicons name="bookmark" size={24} color={isSaved ? '#FF3E91' : 'gray'} />
        </Pressable>
      </View>
      <View className="absolute bottom-6 inset-x-0 px-6 z-10">
        <View className="absolute bottom-6 inset-x-0 px-4 z-10">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={onPrevChapter}
              className="bg-black/50 w-10 h-10 rounded-full justify-center items-center"
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </Pressable>

            <Pressable
              onPress={onNextChapter}
              className="bg-black/50 w-10 h-10 rounded-full justify-center items-center"
            >
              <Ionicons name="chevron-forward" size={20} color="white" />
            </Pressable>
          </View>
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
