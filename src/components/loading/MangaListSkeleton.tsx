import { View } from 'react-native'
import SkeletonPlaceholder from './SkeletonPlaceholder'

export default function MangaListSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: 16 }}>
            <SkeletonPlaceholder width={100} height={150} borderRadius={8} />
            <View style={{ flex: 1, marginLeft: 12 }}>
            <SkeletonPlaceholder width="80%" height={20} />
            <SkeletonPlaceholder width="60%" height={14} style={{ marginTop: 8 }} />
            </View>
        </View>
        ))}
    </>
  )
}
