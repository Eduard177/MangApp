import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

export default function MainBar() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View  style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={30} color="white" />
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ExploreScreen')}>
        <Ionicons name="search" size={30} color="white" />
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SettingsScreen')}>
        <Ionicons name="bookmark" size={30} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: '#FF3E91', // rosa
        width: 240,
        borderRadius: 20,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
  },
});