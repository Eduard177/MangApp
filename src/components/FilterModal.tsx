import React, { forwardRef, useState, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import MSwitch from './MSwitch';
import { useColorScheme } from 'nativewind';
import { Modalize } from 'react-native-modalize';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface FilterModalProps {
  numColumns?: number;
  setNumColumns?: React.Dispatch<React.SetStateAction<number>>;
  filterContext: 'home' | 'manga';
  filters: {
    onlyDownloaded: boolean;
    unread: boolean;
    completed: boolean;
    started: boolean;
    orderBy: string;
    direction: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onFilterChange?: (filters: { [key: string]: any }) => void;
}

const FilterModal = forwardRef<Modalize, FilterModalProps>(
  ({ numColumns, setNumColumns, filterContext, filters, setFilters, onFilterChange }, ref) => {
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'filter' | 'appear'>('filter');

    const { colorScheme } = useColorScheme();
    const [slideAnim] = useState(new Animated.Value(height));
    const [opacityAnim] = useState(new Animated.Value(0));
    const [tabSlideAnim] = useState(new Animated.Value(0));

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
    }));

    const isDark = colorScheme === 'dark';

    const handleTabChange = (tab: 'filter' | 'appear') => {
      setActiveTab(tab);
      Animated.timing(tabSlideAnim, {
        toValue: tab === 'filter' ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const handleClose = () => {
      ref.current?.close();
    };

    const updateFilter = (key: string, value: any) => {
      if (!filters || typeof filters !== 'object') return;

      const updated = { ...filters, [key]: value };
      setFilters(updated);
      onFilterChange?.(updated);
    };
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
        statusBarTranslucent={true}
      >
        <Animated.View 
            className="flex-1 justify-end bg-black/50"
            style={{ opacity: opacityAnim }}
        >
          <Pressable className="flex-1" onPress={handleClose} />
          <Animated.View
            className="bg-white dark:bg-gray-900 rounded-t-3xl pb-8 max-h-[70%]"
            style={{
                transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Handle */}
            <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mt-3 mb-4" />

            {/* --- HOME FILTER --- */}
            {filterContext === 'home' && (
              <View className="flex-1">
                {/* Tabs */}
                <View className="flex-row border-b border-gray-200 dark:border-gray-800 px-4 mb-4">
                  <Pressable
                    onPress={() => handleTabChange('filter')}
                    className={`mr-6 pb-3 ${activeTab === 'filter' ? 'border-b-2 border-pink-500' : ''}`}
                  >
                    <Text className={`text-base font-semibold ${activeTab === 'filter' ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      Filters
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleTabChange('appear')}
                    className={`mr-6 pb-3 ${activeTab === 'appear' ? 'border-b-2 border-pink-500' : ''}`}
                  >
                    <Text className={`text-base font-semibold ${activeTab === 'appear' ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      Appearance
                    </Text>
                  </Pressable>
                </View>

                <Animated.View
                  style={{
                    flexDirection: 'row',
                    width: width * 2,
                    transform: [
                      {
                        translateX: tabSlideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -width],
                        }),
                      },
                    ],
                  }}
                >
                  {/* Filter Tab Content */}
                  <View style={{ width }} className="px-6">
                    {['onlyDownloaded', 'unread', 'completed', 'started'].map((key) => (
                        <View key={key} className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                            <Text className="text-base text-gray-800 dark:text-gray-200 font-medium">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                            </Text>
                            <MSwitch
                                value={filters?.[key] ?? false}
                                onValueChange={(val) => updateFilter(key, val)}
                            />
                        </View>
                    ))}
                  </View>

                  {/* Appearance Tab Content */}
                  {typeof numColumns !== 'undefined' && (
                    <View style={{ width }} className="px-6">
                        <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                            Grid Columns
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                            {[2, 3, 4, 5].map((num) => (
                            <Pressable
                                key={num}
                                onPress={() => setNumColumns(num)}
                                className={`px-5 py-2.5 rounded-xl border ${
                                    numColumns === num 
                                    ? 'bg-pink-500 border-pink-500' 
                                    : 'bg-gray-100 dark:bg-gray-800 border-transparent'
                                }`}
                            >
                                <Text
                                    className={`font-semibold ${
                                        numColumns === num ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                {num}
                                </Text>
                            </Pressable>
                            ))}
                        </View>
                    </View>
                  )}
                </Animated.View>
              </View>
            )}

            {/* --- MANGA FILTER --- */}
            {filterContext === 'manga' && (
              <View className="px-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sort Options</Text>
                
                <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Sort By
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {['rating', 'followedCount', 'createdAt', 'updatedAt'].map((order) => (
                    <Pressable
                        key={order}
                        onPress={() => updateFilter('orderBy', order)}
                        className={`px-4 py-2 rounded-full border ${
                            filters?.orderBy === order
                            ? 'bg-pink-500 border-pink-500'
                            : 'bg-transparent border-gray-300 dark:border-gray-600'
                        }`}
                    >
                        <Text className={`text-sm font-medium ${
                            filters?.orderBy === order ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                            {order === 'followedCount' ? 'Follows' : 
                             order === 'createdAt' ? 'Added' : 
                             order === 'updatedAt' ? 'Updated' : 
                             order.charAt(0).toUpperCase() + order.slice(1)}
                        </Text>
                    </Pressable>
                    ))}
                </View>

                <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Direction
                </Text>
                <View className="flex-row gap-3">
                    {['asc', 'desc'].map((dir) => (
                    <Pressable
                        key={dir}
                        onPress={() => updateFilter('direction', dir)}
                        className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-xl border ${
                            filters?.direction === dir
                            ? 'bg-pink-500/10 border-pink-500'
                            : 'bg-gray-50 dark:bg-gray-800 border-transparent'
                        }`}
                    >
                        <Ionicons 
                            name={dir === 'asc' ? 'arrow-up' : 'arrow-down'} 
                            size={18} 
                            color={filters?.direction === dir ? '#ec4899' : isDark ? '#9ca3af' : '#4b5563'} 
                        />
                        <Text className={`ml-2 font-medium ${
                            filters?.direction === dir ? 'text-pink-500' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                            {dir === 'asc' ? 'Ascending' : 'Descending'}
                        </Text>
                    </Pressable>
                    ))}
                </View>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);



FilterModal.displayName = 'FilterModal';
export default FilterModal;
