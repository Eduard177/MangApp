import { View , Text } from 'react-native';
import SkeletonPlaceholder from './SkeletonPlaceholder';

export default function MangaCarouselSkeleton({ title }: Readonly<{ title: string }>) {
  return (
    <View className="mb-6 min-h-[240px]">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold dark:text-white">{title}</Text>
      </View>

      <View className="flex-row">
        {[...Array(5)].map((_, i) => (
          <View key={i} className="mr-4">
            <SkeletonPlaceholder width={120} height={180} borderRadius={8} />
            <SkeletonPlaceholder width={112} height={14} style={{ marginTop: 6 }} />
            <SkeletonPlaceholder width={100} height={12} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}
