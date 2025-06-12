import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { deleteChapter, downloadChapter, isChapterDownloaded } from '../utils/downloadChapter';
import DownloadChapterIcon from '../assets/components/DownloadCharpterIcon';
import { markChapterAsRead } from '../utils/readHistory';
import { useIncognito } from '../context/incognito-context';
interface ChapterItemProps {
  item: any;
  mangaId: string;
  navigation: any;
  isRead: boolean;
  onMarkAsRead: (chapterId: string) => void;
}
export default function ChapterItem({ item, mangaId, navigation, isRead, onMarkAsRead }: Readonly<ChapterItemProps>) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { incognito } = useIncognito();

  useEffect(() => {
    const check = async () => {
      const downloaded = await isChapterDownloaded(mangaId, item.id, 5);
      setIsDownloaded(downloaded);
    };
    check();
  }, [isDownloading]);

  const handleDownload = async () => {
    setIsDownloading(true);
    if (isDownloaded) {
      await deleteChapter(mangaId, item.id);
    } else {
      await downloadChapter(item.id, mangaId);
      setIsDownloaded(true);
    }
    setIsDownloading(false);
  };

  
  const handleOpenReader = async () => {
    if (!incognito) {
      await markChapterAsRead(item.id);
      onMarkAsRead(item.id);
    }
    navigation.navigate('ChapterReader', {
        chapterId: item.id,
        mangaId,
    });

  };
  return (
    <Pressable
      onPress={handleOpenReader}
      className="px-4 py-1 dark:border-gray-700"
    >
      <View className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 mb-2 flex-row justify-between items-center">
        <View className="flex-1 flex-row items-center space-x-1">
          <Text
            className={`text-base font-medium ${
              !incognito && isRead ? 'text-pink-500' : 'text-black dark:text-white'
            }`}
          >
            Capítulo {item.attributes.chapter ?? 'N/A'}
          </Text>
          <Text
            className={`text-sm font-open-sans ${
              !incognito && isRead ? 'text-pink-500' : 'text-gray-900 dark:text-gray-300'
            }`}
          >
            {item.attributes.title ?? 'Sin título'}
          </Text>
        </View>
        <Pressable onPress={handleDownload}>
          <DownloadChapterIcon size={16} downloaded={isDownloaded} isDownloading={isDownloading} />
        </Pressable>
      </View>
    </Pressable>
  );
}