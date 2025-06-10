import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useColorScheme } from 'nativewind';
import Logo from '../assets/components/Logo';

interface NavbarProps {
  onFilter: () => void;
  onReload: () => void;
}

export default function Navbar({ onFilter, onReload }: Readonly<NavbarProps>) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {colorScheme} = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? 'white' : 'black';

  return (
    <View className="flex flex-row justify-between items-center p-4 pt-12 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <View>
        <Pressable onPress={() => navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
                })}>
          <Logo />
        </Pressable>
      </View>

      <View className="flex-row space-x-4">
        <Pressable onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="search" size={28} color={textColor} />
        </Pressable>

        <Pressable onPress={onFilter}>
          <Ionicons name="options" size={28} color={textColor} />
        </Pressable>

        <Pressable onPress={onReload}>
          <Ionicons name="refresh" size={28} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
}
