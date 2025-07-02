// src/screens/SettingsScreen.tsx
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useRef } from 'react';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import MainBar from '../components/MainBar';
import MSwitch from '../components/MSwitch';
import LanguageModal from '../components/LanguageModal';
import { Modalize } from 'react-native-modalize';
import DarkModeToggle from '../components/DarkModeToggle';
import Logo from '../assets/components/Logo';
import { useIncognito } from '../context/incognito-context';
import ReaderModeModal from '../components/ReaderModeModal';
export default function SettingsScreen() {
  const { incognito, toggleIncognito } = useIncognito();
  const languageModalRef = useRef<Modalize>(null);
  const modalRef = useRef<Modalize>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  return (
    <View className='flex-1 bg-white dark:bg-gray-900'>
    <ScrollView className="bg-gray-100 px-4 pt-11 top-4 dark:bg-gray-900">
      <View className="items-center mb-6">
        <View>
            <Pressable onPress={() =>
                navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
                })
            }>
                <Logo />
            </Pressable>
        </View>
      </View>

      <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="glasses-outline" size={20} color="#ec4899" />
              <Text className="text-base font-medium dark:text-white">Mod Incognito</Text>
            </View>
            <MSwitch 
                value={incognito} 
                onValueChange={toggleIncognito}
            />
          </View>

          <DarkModeToggle />

      </View>
      <View className="mt-6 space-y-6">
        <TouchableOpacity
          className="flex-row items-center space-x-3"
          onPress={() => languageModalRef.current?.open()}
        >
            <Feather name="globe" size={20} color="#ec4899" />
            <Text className="text-base font-medium dark:text-white">Languages</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center space-x-3"
          onPress={() => modalRef.current?.open()}
        >
          <Feather name="settings" size={20} color="#ec4899"/>
          <Text className="text-base font-medium dark:text-white">Config</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center space-x-3">
          <MaterialIcons name="info" size={20} color="#f43f5e" />
          <Text className="text-base font-medium dark:text-white">About it</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center space-x-3">
          <Feather name="help-circle" size={20} color="#ec4899" />
          <Text className="text-base font-medium dark:text-white">Help</Text>
        </TouchableOpacity>
 
      </View>
    </ScrollView>

    <MainBar currentRouteName={route.name}/>
    <LanguageModal ref={languageModalRef} />
    <ReaderModeModal ref={modalRef} />

  </View>
  );
}
