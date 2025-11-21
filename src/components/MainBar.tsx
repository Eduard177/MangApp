import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue, ZoomIn } from 'react-native-reanimated';
import HomeIcon from '../assets/components/HomeIcon';
import SettingIcon from '../assets/components/SettingIcon';
import ExploreIcon from '../assets/components/ExploreIcon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const TAB_BAR_WIDTH = 260;

export default function MainBar({ state, descriptors, navigation }: BottomTabBarProps) {
  
  const icons: Record<string, any> = {
    Home: HomeIcon,
    ExploreScreen: ExploreIcon,
    SettingScreen: SettingIcon,
  };

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="light" style={styles.blurContainer}>
        <TabContent state={state} descriptors={descriptors} navigation={navigation} icons={icons} />
      </BlurView>
    </View>
  );
}

function TabContent({ state, descriptors, navigation, icons }: any) {
  const totalTabs = state.routes.length;
  const tabWidth = TAB_BAR_WIDTH / totalTabs;
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index, tabWidth]);

  const cursorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.contentContainer}>
      <Animated.View
        style={[
          styles.cursorContainer,
          { width: tabWidth },
          cursorStyle,
        ]}
      >
        <View style={styles.cursorBubble} />
      </Animated.View>

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const Icon = icons[route.name] || HomeIcon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            Icon={Icon}
          />
        );
      })}
    </View>
  );
}

function TabButton({ onPress, onLongPress, isFocused, Icon }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isFocused ? 1.1 : 1) }],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.button, animatedStyle]}
    >
      <Icon fill={!isFocused ? 'white' : '#FF3E91'} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: TAB_BAR_WIDTH,
    height: 70,
    borderRadius: 999,
    overflow: 'hidden', // Important for BlurView to respect borderRadius
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'transparent',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 62, 145, 0.2)', // Glass effect
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursorContainer: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  cursorBubble: {
    width: 70,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    zIndex: 1,
  },
});

