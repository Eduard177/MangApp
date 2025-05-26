import { useCallback, useEffect, useState } from 'react';
import { clearContinueReading, getContinueReading } from '../services/storage';
import Navbar from '../components/Navbar';
import { Pressable, ScrollView, View, Text } from 'react-native';
import ContinueReadingCarousel from '../components/ContinueReadingCarousel';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useContinueReadingStore } from '../store/useContinueReadingStore';
import MainBar from '../components/MainBar';

export default function HomeScreen() {
  const [continueReading, setContinueReading] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const route = useRoute();
  
  useEffect(() => {
    const loadContinueReading = async () => {
      const data = await getContinueReading();
      setContinueReading(data);
    };
    loadContinueReading();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Al volver a la pantalla, recarga el historial
      useContinueReadingStore.getState().toggleReload();
    }, [])
);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => console.log('Filter pressed')}
        onReload={() => setReloadFlag((prev) => !prev)}
      />

        <ScrollView className="p-4 bg-white dark:bg-black">
            <ContinueReadingCarousel />

        {/* <Pressable onPress={clearContinueReading} className="bg-red-500 px-4 py-2 rounded">
          <Text className="text-white text-center font-semibold">Borrar historial</Text>
        </Pressable> */}
        </ScrollView>

        <MainBar currentRouteName={route.name}/>
        
    </View>
  );
}
