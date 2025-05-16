import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  onSearch: () => void;
  onFilter: () => void;
  onReload: () => void;
}

export default function Navbar({ onSearch, onFilter, onReload }: Readonly<NavbarProps>) {
  return (
    <View className="flex flex-row items-center justify-between p-4 pt-14 bg-white dark:bg-black">
      {/* Logo a la izquierda */}
      <Image
        source={require('../assets/icon.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
        className="rounded-full"
      />

      {/* Botones a la derecha */}
      <View className="flex-row space-x-4">
        <Pressable onPress={onSearch}>
          <Ionicons name="search" size={28} color="black" />
        </Pressable>

        <Pressable onPress={onFilter}>
          <Ionicons name="filter" size={28} color="black" />
        </Pressable>

        <Pressable onPress={onReload}>
          <Ionicons name="refresh" size={28} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
