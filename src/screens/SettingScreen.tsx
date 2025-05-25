// src/screens/SettingsScreen.tsx
import { View, Text, Switch, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import Logo from '../assets/Logo.svg';
export default function SettingsScreen() {
  const [onlyUpdates, setOnlyUpdates] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-11 top-4">
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

      <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="cloud-offline" size={20} color="#ec4899" />
            <Text className="text-base font-medium">Only updates</Text>
          </View>
          <Switch value={onlyUpdates} onValueChange={setOnlyUpdates} />
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="glasses-outline" size={20} color="#ec4899" />
            <Text className="text-base font-medium">Mod Incognito</Text>
          </View>
          <Switch value={incognitoMode} onValueChange={setIncognitoMode} />
        </View>
      </View>

      <View className="mt-6 space-y-6">
        <TouchableOpacity className="flex-row items-center space-x-3">
          <Feather name="settings" size={20} color="#ec4899" />
          <Text className="text-base font-medium">Config</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center space-x-3">
          <MaterialIcons name="info" size={20} color="#f43f5e" />
          <Text className="text-base font-medium">About it</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center space-x-3">
          <Feather name="help-circle" size={20} color="#ec4899" />
          <Text className="text-base font-medium">Help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
