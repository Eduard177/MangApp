import { useEffect, useState } from 'react';
import { getContinueReading } from '../services/storage';
import Navbar from '../components/Navbar';
import { ScrollView, View } from 'react-native';
import ContinueReadingCarousel from '../components/ContinueReadingCarousel';
import { useContinueReadingStore } from '../store/useContinueReadingStore';

export default function HomeScreen() {
  const [continueReading, setContinueReading] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  useEffect(() => {
    const loadContinueReading = async () => {
      const data = await getContinueReading();
      setContinueReading(data);
    };
    loadContinueReading();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => console.log('Filter pressed')}
        onReload={() => setReloadFlag((prev) => !prev)}
      />

        <ScrollView className="p-4 bg-white dark:bg-black">
            <ContinueReadingCarousel />
        </ScrollView>
    </View>
  );
}
