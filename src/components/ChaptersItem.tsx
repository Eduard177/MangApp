import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { deleteChapter, downloadChapter, isChapterDownloaded } from '../utils/downloadChapter';
import DownloadChapterIcon from '../assets/components/DownloadCharpterIcon';

interface ChapterItemProps {
  item: any;
  mangaId: string;
  navigation: any;
}

export default function ChapterItem({ item, mangaId, navigation }: Readonly<ChapterItemProps>) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkDownload = async () => {
      const downloaded = await isChapterDownloaded(mangaId, item.id, 5);
      setIsDownloaded(downloaded);
    };
    checkDownload();
  }, [isDownloading]);

  const handleDownload = async () => {
    if (isDownloaded) {
      setIsDownloading(true)
      await deleteChapter(mangaId, item.id)
      console.log('Eliminar capítulo');
    } else {
      setIsDownloading(true)
      await downloadChapter(item.id, mangaId);
      setIsDownloaded(true);
    }
    setIsDownloading(false)
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChapterReader', {
          chapterId: item.id,
          mangaId,
        })
      }
      className="px-4 py-1 dark:border-gray-700"
    >
      <View className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center">
        <View className="flex-1 flex-row items-center space-x-1">
          <Text className="text-black dark:text-white text-base font-medium">
            Capítulo {item.attributes.chapter ?? 'N/A'}
          </Text>
          <Text className="text-sm text-gray-900 font-open-sans dark:text-gray-300">
            {item.attributes.title ?? 'Sin título'}
          </Text>
        </View>
        <Pressable onPress={handleDownload}>
          <DownloadChapterIcon downloaded={isDownloaded} isDownloading={isDownloading}/>
        </Pressable>
      </View>
    </Pressable>
  );
}
