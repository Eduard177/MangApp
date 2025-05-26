import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import HomeIcon from '../assets/components/HomeIcon'
import SettingIcon from '../assets/components/SettingIcon'
import ExploreIcon from '../assets/components/ExploreIcon'
type Props = {
  currentRouteName: string;
};

export default function MainBar({ currentRouteName }: Readonly<Props>) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

const icons = [
  { route: 'Home', Icon: HomeIcon  },
  { route: 'ExploreScreen', Icon: ExploreIcon },
  { route: 'SettingScreen', Icon: SettingIcon },
];

  return (
    <View style={styles.container}>
      {icons.map(({ route, Icon }) => {
        const isActive = currentRouteName === route;
        return (
          <Pressable
            key={route}
            onPress={() => {
              if (route === 'Home') {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
              } else {
                navigation.navigate(route as never);
              }
            }}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Icon fill={!isActive ? 'white' : '#FF3E91'} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#FF3E91',
    width: 240,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    padding: 10,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'white',
  },
});
