import { View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import Logo from '../assets/components/Logo';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation';

interface Props {
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isEditing: boolean;
  setIsEditing: () => void; // activa edición y checkAll
  onDeleteSelected: () => void;
  selectedCount: number;
  onCancelEditing: () => void;
}

export default function NavbarContinueReading({
  isSearching,
  setIsSearching,
  searchQuery,
  setSearchQuery,
  isEditing,
  setIsEditing,
  onDeleteSelected,
  selectedCount,
  onCancelEditing
}: Readonly<Props>) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? 'white' : 'black';

  return (
    <View className="flex-row items-center justify-between p-4 pt-12 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <View className="flex-row  items-center space-x-2 flex-1">
        {!isSearching && (
        <Pressable
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
        >
          <Logo />
        </Pressable>
        )}
        {isSearching && (
          <TextInput
            placeholder="Search saved mangas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 py-2 ml-4 rounded text-black dark:text-white"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
          />
        )}
      </View>

      <View className="flex-row space-x-4 ml-4">
        {isEditing ? (
          <>
            {selectedCount > 0 && (
              <Pressable onPress={onDeleteSelected}>
                <Ionicons name="checkmark-done" size={28} color="#ef4444" />
              </Pressable>
            )}
            <Pressable onPress={onCancelEditing}>
              <Ionicons name="close" size={28} color={textColor} />
            </Pressable>
          </>
        ) : (
          <>
            {!isSearching && (
              <Pressable onPress={() => setIsSearching(true)}>
                <Ionicons name="search" size={28} color={textColor} />
              </Pressable>
            )}

            <Pressable onPress={setIsEditing}>
              <Ionicons name="trash" size={28} color={textColor} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
