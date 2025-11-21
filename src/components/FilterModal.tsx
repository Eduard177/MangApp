import React, { forwardRef, useState, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  Pressable,
  Modal,
  TouchableOpacity,
  StyleSheet,
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
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const FilterModal = forwardRef<Modalize, FilterModalProps>(
  ({ numColumns, setNumColumns, filterContext, filters, setFilters }, ref) => {
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'filter' | 'appear'>('filter');
    const { colorScheme } = useColorScheme();
    const [slideAnim] = useState(new Animated.Value(height));
    const [opacityAnim] = useState(new Animated.Value(0));
    const [tabSlideAnim] = useState(new Animated.Value(0));

    const isDark = colorScheme === 'dark';

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

    const handleTabChange = (tab: 'filter' | 'appear') => {
      setActiveTab(tab);
      Animated.timing(tabSlideAnim, {
        toValue: tab === 'filter' ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const updateFilter = (key: string, value: any) => {
      if (!filters || typeof filters !== 'object') return;

      const updated = { ...filters, [key]: value };
      setFilters(updated);
    };

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
            
            <View className="pb-8 pt-2">
                {/* --- HOME FILTER --- */}
                {filterContext === 'home' && (
                  <View>
                    {/* Tabs */}
                    <View className="flex-row mx-6 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                      <Pressable
                        onPress={() => handleTabChange('filter')}
                        className={`flex-1 py-2.5 rounded-lg items-center justify-center ${
                          activeTab === 'filter' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                        }`}
                      >
                        <Text className={`font-semibold ${
                          activeTab === 'filter' ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Filters
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleTabChange('appear')}
                        className={`flex-1 py-2.5 rounded-lg items-center justify-center ${
                          activeTab === 'appear' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                        }`}
                      >
                        <Text className={`font-semibold ${
                          activeTab === 'appear' ? 'text-pink-500' : 'text-gray-500 dark:text-gray-400'
                        }`}>
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
                        {['onlyDownloaded', 'unread', 'completed', 'started'].map((key) => {
                            let iconName: any = 'options-outline';
                            let label = key;
                            
                            if (key === 'onlyDownloaded') { iconName = 'download-outline'; label = 'Downloaded'; }
                            else if (key === 'unread') { iconName = 'ellipse-outline'; label = 'Unread'; }
                            else if (key === 'completed') { iconName = 'checkmark-done-circle-outline'; label = 'Completed'; }
                            else if (key === 'started') { iconName = 'book-outline'; label = 'Reading'; }

                            return (
                                <View key={key} className="flex-row items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
                                    <View className="flex-row items-center gap-3">
                                        <View className={`w-8 h-8 rounded-full items-center justify-center ${
                                            filters?.[key] ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                            <Ionicons name={iconName} size={18} color={filters?.[key] ? '#ec4899' : (isDark ? '#9ca3af' : '#6b7280')} />
                                        </View>
                                        <Text className="text-base text-gray-800 dark:text-gray-200 font-medium">
                                            {label}
                                        </Text>
                                    </View>
                                    <MSwitch
                                        value={filters?.[key] ?? false}
                                        onValueChange={(val) => updateFilter(key, val)}
                                    />
                                </View>
                            );
                        })}
                      </View>

                      {/* Appearance Tab Content */}
                      {typeof numColumns !== 'undefined' && (
                        <View style={{ width }} className="px-6">
                            <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                                Grid Layout
                            </Text>
                            <View className="flex-row justify-between gap-3">
                                {[2, 3, 4, 5].map((num) => (
                                <Pressable
                                    key={num}
                                    onPress={() => setNumColumns && setNumColumns(num)}
                                    className={`flex-1 py-4 rounded-2xl border items-center justify-center ${
                                        numColumns === num 
                                        ? 'bg-pink-500 border-pink-500' 
                                        : 'bg-gray-50 dark:bg-gray-800 border-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={num === 2 ? 'grid-outline' : 'apps-outline'} 
                                        size={24} 
                                        color={numColumns === num ? 'white' : (isDark ? '#9ca3af' : '#6b7280')} 
                                        style={{ marginBottom: 4 }}
                                    />
                                    <Text
                                        className={`font-bold text-lg ${
                                            numColumns === num ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                    {num}
                                    </Text>
                                    <Text className={`text-xs ${
                                        numColumns === num ? 'text-white/80' : 'text-gray-500'
                                    }`}>Columns</Text>
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
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
);

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
    maxHeight: height * 0.8,
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



FilterModal.displayName = 'FilterModal';
export default FilterModal;
