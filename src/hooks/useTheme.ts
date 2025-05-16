// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const theme = useColorScheme(); // 'light' | 'dark' | null
  return theme ?? 'light';
};
