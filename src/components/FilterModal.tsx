import React, { forwardRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MSwitch from './MSwitch';
import { useColorScheme } from 'nativewind';

const FilterModal = forwardRef<Modalize>((_, ref) => {
    const [onlyDownloaded, setOnlyDownloaded] = useState(false);
    const [dontReaded, setDontReaded ] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [started, setStarted] = useState(false)
    const colorScheme = useColorScheme();

    const styles = StyleSheet.create({
      container: {
        backgroundColor: colorScheme.colorScheme === 'dark' ? '#1f2937' : '#fff',
        padding: 20,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colorScheme.colorScheme === 'dark' ? '#fff': '#1f2937',
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 10,
      },
      label: {
        fontSize: 14,
        marginLeft: 10,
        alignSelf: 'center',
        color: colorScheme.colorScheme === 'dark' ? '#fff': '#1f2937',
      },
    });
    
  return (
    <Modalize ref={ref} adjustToContentHeight scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Filtrar</Text>

        <View style={styles.row}>
          <MSwitch value={onlyDownloaded} onValueChange={setOnlyDownloaded}/>
          <Text style={styles.label}>Descargados</Text>
        </View>

        <View style={styles.row}>
          <MSwitch value={dontReaded} onValueChange={setDontReaded}/>
          <Text style={styles.label}>Sin Leer</Text>
        </View>

        <View style={styles.row}>
          <MSwitch value={completed} onValueChange={setCompleted}/>
          <Text style={styles.label}>Completados</Text>
        </View>

        <View style={styles.row}>
          <MSwitch value={started} onValueChange={setStarted}/>

          <Text style={styles.label}>Empezados</Text>
        </View>
      </View>
    </Modalize>
  );
});

export default FilterModal;
