import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native'; // ajusta el path según tu proyecto
import { RootStackParamList } from '../navigation';
import Logo from '../assets/Logo.svg';

interface NavbarProps {
  onFilter: () => void;
  onReload: () => void;
}

export default function Navbar({ onFilter, onReload }: Readonly<NavbarProps>) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="flex flex-row justify-between items-center p-4 pt-12 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700">
      {/* Logo */}
      <View>
        <Pressable onPress={() => navigation.navigate('Home')}>
               <Logo />
        </Pressable>
      </View>

      {/* Botones */}
      <View className="flex-row space-x-4">
        <Pressable onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="search" size={28} color="black" />
        </Pressable>

        <Pressable onPress={onFilter}>
          <Ionicons name="options" size={28} color="black" />
        </Pressable>

        <Pressable onPress={onReload}>
          <Ionicons name="refresh" size={28} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
