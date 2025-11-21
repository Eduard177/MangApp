import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { View, Text, Pressable, Modal, TouchableOpacity, Dimensions, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguageStore } from '../store/useLanguageStore';
import { useColorScheme } from 'nativewind';
import { Modalize } from 'react-native-modalize';

const { height } = Dimensions.get('window');

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Español (LatAm)', value: 'es-la' },
];

const LanguageModal = forwardRef<Modalize>((_, ref) => {
  const [selected, setSelected] = useState('en');
  const { setLanguage } = useLanguageStore();
  
  const [visible, setVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const [slideAnim] = useState(new Animated.Value(height));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('apiLanguage');
      if (saved) {
        setSelected(saved);
        setLanguage(saved);
      }
    };
    load();
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    close: () => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    },
  } as any));

  const handleClose = () => {
    // @ts-ignore
    ref.current?.close();
  };

  const select = async (value: string) => {
    setSelected(value);
    await AsyncStorage.setItem('apiLanguage', value);
    setLanguage(value);
    handleClose();
  };

  const isDark = colorScheme === 'dark';

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={handleClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? '#1f2937' : '#fff',
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: isDark ? '#fff' : '#ccc' }]} />
          <View className="p-4">
            <Text className="text-base font-bold mb-4 dark:text-white">Idioma preferido</Text>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.value}
                onPress={() => select(lang.value)}
                className={`flex-row items-center justify-between px-4 py-2 rounded-md mb-2 border  ${
                  selected === lang.value ? 'border-pink-500 bg-pink-50 dark:bg-gray-700' : 'border-gray-300'
                }`}
              >
                <Text className="text-sm dark:text-white">{lang.label}</Text>
                {selected === lang.value && (
                  <Text className="text-pink-500 font-semibold">✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: height * 0.7,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
});

export default LanguageModal;
