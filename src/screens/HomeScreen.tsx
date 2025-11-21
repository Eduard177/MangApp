import { useCallback, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { ScrollView, View } from 'react-native';
import ContinueReadingCarousel from '../components/ContinueReadingCarousel';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useContinueReadingStore } from '../store/useContinueReadingStore';
import { Modalize } from 'react-native-modalize';
import FilterModal from '../components/FilterModal';
import SavedMangasGrid from '../components/SavedMangas';
import { useFilterStore } from '../store/useFilterStore';

export default function HomeScreen() {
  const filterRef = useRef<Modalize>(null);
  const navigation = useNavigation();

  const { home, setFilter, setNumColumns, numColumns } = useFilterStore();

  const openFilterModal = () => {
    filterRef.current?.open();
  };

  const route = useRoute();

  const [reloadFlag, setReloadFlag] = useState(false);

  useFocusEffect(
    useCallback(() => {
      useContinueReadingStore.getState().toggleReload();
    }, [])
  );

  const handlePageReload = () => {
    setReloadFlag((prev) => !prev);
    useContinueReadingStore.getState().toggleReload();
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Navbar
        onFilter={openFilterModal}
        onReload={handlePageReload}
      />

      <ScrollView className="p-4 bg-white dark:bg-gray-900">
        <ContinueReadingCarousel />
        <SavedMangasGrid numColumns={numColumns} filters={home} reloadTrigger={reloadFlag} />
      </ScrollView>

      <FilterModal
        ref={filterRef}
        filterContext="home"
        filters={home}
        setFilters={(newFilters) => setFilter('home', newFilters)}
        numColumns={numColumns}
        setNumColumns={setNumColumns}
      />
    </View>
  );
}
