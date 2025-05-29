import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native'; // ajusta el path según tu proyecto
import { RootStackParamList } from '../navigation';
import Logo from '../assets/Logo.svg';
import { useColorScheme } from 'nativewind';

interface NavbarProps {
  onFilter: () => void;
  onReload: () => void;
}

export default function Navbar({ onFilter, onReload }: Readonly<NavbarProps>) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const colorScheme = useColorScheme();
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
          <Ionicons name="search" size={28} color={colorScheme.colorScheme=== 'dark' ? 'white' : 'black'} />
        </Pressable>

        <Pressable onPress={onFilter}>
          <Ionicons name="options" size={28} color={colorScheme.colorScheme=== 'dark' ? 'white' : 'black'} />
        </Pressable>

        <Pressable onPress={onReload}>
          <Ionicons name="refresh" size={28} color={colorScheme.colorScheme=== 'dark' ? 'white' : 'black'} />
        </Pressable>
      </View>
    </View>
  );
}
