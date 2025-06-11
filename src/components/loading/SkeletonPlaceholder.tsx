import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface SkeletonPlaceholderProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: any;
}

export default function SkeletonPlaceholder({
  width,
  height,
  borderRadius = 4,
  style,
}: Readonly<SkeletonPlaceholderProps>) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.placeholder,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#e5e7eb', // gray-200
  },
});
