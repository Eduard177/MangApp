import AsyncStorage from '@react-native-async-storage/async-storage';

export const getApiLanguage = async (): Promise<string> => {
  const lang = await AsyncStorage.getItem('apiLanguage');
  return lang || 'en';
};
