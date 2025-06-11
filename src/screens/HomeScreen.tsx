import { useCallback, useEffect, useRef, useState } from 'react';
import { clearContinueReading, getContinueReading } from '../services/storage';
import Navbar from '../components/Navbar';
import { Pressable, ScrollView, View, Text, Button } from 'react-native';
import ContinueReadingCarousel from '../components/ContinueReadingCarousel';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useContinueReadingStore } from '../store/useContinueReadingStore';
import MainBar from '../components/MainBar';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';
import SavedMangasGrid from '../components/SavedMangas';
import { clearReadHistory } from '../utils/readHistory';

export default function HomeScreen() {
  const [continueReading, setContinueReading] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const filterRef = useRef<Modalize>(null);
  const [numColumns, setNumColumns] = useState(3);
  const [filters, setFilters] = useState({});
  const openFilterModal = () => {
    filterRef.current?.open();
  };

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
      useContinueReadingStore.getState().toggleReload();
    }, [])
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={() => openFilterModal()}
        onReload={() => setReloadFlag((prev) => !prev)}
      />

      <ScrollView className="p-4 bg-white dark:bg-gray-900">
        <ContinueReadingCarousel />
        <SavedMangasGrid numColumns={numColumns} filters={filters} />
      </ScrollView>

      <FilterModal
        ref={filterRef}
        numColumns={numColumns}
        setNumColumns={setNumColumns}
        filterContext="home"
        onFilterChange={(f) => setFilters(f)}
      />

      <MainBar currentRouteName={route.name} />
    </View>
  );
}
