import React from 'react';
import Svg, { G, Rect, Text } from 'react-native-svg';

type Props = {
  width?: number;
  height?: number;
};

export default function Logo({ width = 137, height = 34 }: Readonly<Props>) {
  return (
    <Svg x="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 137 34">
      <G transform="translate(0 0)">
        <Rect width="137" height="34" rx="17" fill="#FF3E91" />
        <Text
          x="16"
          y="25"
          fill="#FFFFFF"
          fontSize="22"
          fontWeight="700"
          fontFamily="System"
        >
          MangApp
        </Text>
      </G>
    </Svg>
  );
}
