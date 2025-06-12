import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from './SkeletonPlaceholder';

interface Props {
  numColumns: number;
  totalItems?: number;
}

export default function SavedMangaSkeleton({ numColumns, totalItems = 30 }: Readonly<Props>) {
  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 16;
  const spacing = 8;
  
  const availableWidth = screenWidth - horizontalPadding;
  
  const itemWidth = (availableWidth - (spacing * (numColumns - 1))) / numColumns;

  const renderRows = () => {
    const rows = [];
    for (let i = 0; i < totalItems; i += numColumns) {
      const rowItems = [];
      
      for (let j = 0; j < numColumns && (i + j) < totalItems; j++) {
        const itemIndex = i + j;
        const isLastInRow = j === numColumns - 1;
        
        rowItems.push(
          <View
            key={itemIndex}
            style={{
              width: itemWidth,
              marginRight: isLastInRow ? 0 : spacing,
            }}
          >
            <SkeletonPlaceholder width="100%" height={itemWidth * 1.5} borderRadius={8} />
            <SkeletonPlaceholder width="80%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
          </View>
        );
      }
      
      // Agregamos espaciadores si la fila no está completa
      while (rowItems.length < numColumns) {
        rowItems.push(
          <View key={`spacer-${i}-${rowItems.length}`} style={{ width: itemWidth }} />
        );
      }
      
      rows.push(
        <View
          key={i}
          style={{
            flexDirection: 'row',
            marginBottom: spacing,
            justifyContent: 'flex-start',
          }}
        >
          {rowItems}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View className="mt-4 px-2">
      <SkeletonPlaceholder width={100} height={24} borderRadius={4} style={{ marginBottom: 12 }} />
      <View>
        {renderRows()}
      </View>
    </View>
  );
}