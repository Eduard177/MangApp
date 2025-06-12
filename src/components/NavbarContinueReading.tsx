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
  setIsEditing: () => void;
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
      <View className="flex-row items-center">
        {!isSearching && (
        <Pressable
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
          className="mr-4"
        >
          <Logo />
        </Pressable>
        )}
        {isSearching && (
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded px-2 w-[220px]">
            <TextInput
              placeholder="Search saved mangas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 px-2 py-1 text-black dark:text-white"
              placeholderTextColor={isDark ? '#aaa' : '#666'}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={isDark ? '#ccc' : '#888'} />
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="ml-1"
            >
              <Ionicons name="close" size={20} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        )}
      </View>

      <View className="flex-row items-center ml-4">
        {!isEditing && !isSearching && (
          <>
            <View className="mr-6">
              <Pressable onPress={() => setIsSearching(true)}>
                <Ionicons name="search" size={28} color={textColor} />
              </Pressable>
            </View>

            <View>
              <Pressable onPress={setIsEditing}>
                <Ionicons name="trash" size={28} color={textColor} />
              </Pressable>
            </View>
          </>
        )}

        {isEditing && (
          <>
            {selectedCount > 0 && (
              <Pressable onPress={onDeleteSelected} className="mr-4">
                <Ionicons name="checkmark-done" size={28} color="#ef4444" />
              </Pressable>
            )}
            <Pressable onPress={onCancelEditing}>
              <Ionicons name="close" size={28} color={textColor} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
