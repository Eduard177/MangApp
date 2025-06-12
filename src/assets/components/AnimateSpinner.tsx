import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SimpleSVGSpinner = ({ size = 50}) => {
  // Valores animados para posiciones
  const rect1X = useRef(new Animated.Value(1)).current;
  const rect1Y = useRef(new Animated.Value(1)).current;
  const rect2X = useRef(new Animated.Value(1)).current;
  const rect2Y = useRef(new Animated.Value(13)).current;

  const animateSequence = () => {
    const duration = 150; // Más rápido y fluido
    
    Animated.sequence([
      Animated.timing(rect1X, {
        toValue: 13,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect2Y, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect1Y, {
        toValue: 13,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect2X, {
        toValue: 13,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect1X, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect2Y, {
        toValue: 13,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect1Y, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }),
      
      Animated.timing(rect2X, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      animateSequence();
    });
  };

  useEffect(() => {
    animateSequence();
  }, []);

  return (
    <View style={styles.container}>
      <Svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24"
        style={styles.svg}
      >
        <AnimatedRect
          x={rect1X}
          y={rect1Y}
          rx="1"
          width="10"
          height="10"
          fill="#EC4899"
        />
        <AnimatedRect
          x={rect2X}
          y={rect2Y}
          rx="1"
          width="10"
          height="10"
          fill="#EC4899"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
  },
});

export default SimpleSVGSpinner;