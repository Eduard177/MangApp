import React, { forwardRef, useState, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import MSwitch from './MSwitch';
import { useColorScheme } from 'nativewind';
import { Modalize } from 'react-native-modalize';

const { width, height } = Dimensions.get('window');

interface FilterModalProps {
  numColumns: number;
  setNumColumns: React.Dispatch<React.SetStateAction<number>>;
}

const FilterModal = forwardRef<Modalize, FilterModalProps>(({ numColumns, setNumColumns }, ref) => {
  const [onlyDownloaded, setOnlyDownloaded] = useState(false);
  const [dontReaded, setDontReaded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
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

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={handleClose}
        />
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

          <View style={styles.content}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'filter' && styles.activeTab]}
                onPress={() => handleTabChange('filter')}
              >
                <Text style={[styles.tabText, { color: isDark ? '#fff' : '#1f2937' }]}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabItem, activeTab === 'appear' && styles.activeTab]}
                onPress={() => handleTabChange('appear')}
              >
                <Text style={[styles.tabText, { color: isDark ? '#fff' : '#1f2937' }]}>Appear</Text>
              </TouchableOpacity>
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
              <View style={{ width }}>
                <View style={styles.row}>
                  <MSwitch value={onlyDownloaded} onValueChange={setOnlyDownloaded} />
                  <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Descargados</Text>
                </View>

                <View style={styles.row}>
                  <MSwitch value={dontReaded} onValueChange={setDontReaded} />
                  <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Sin Leer</Text>
                </View>

                <View style={styles.row}>
                  <MSwitch value={completed} onValueChange={setCompleted} />
                  <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Completados</Text>
                </View>

                <View style={styles.row}>
                  <MSwitch value={started} onValueChange={setStarted} />
                  <Text style={[styles.label, { color: isDark ? '#fff' : '#1f2937' }]}>Empezados</Text>
                </View>
              </View>

              <View style={{ width }}>
                <View style={styles.columnsRow}>
                  {[2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => setNumColumns(num)}
                      style={[styles.chip, numColumns === num && styles.chipSelected]}
                    >
                      <Text
                        style={{
                          color: numColumns === num ? '#fff' : '#1f2937',
                          fontWeight: '600',
                        }}
                      >
                        {num} columnas
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    marginLeft: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 10,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ec4899',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  columnsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#ec4899',
  },
});

FilterModal.displayName = 'FilterModal';

export default FilterModal;
