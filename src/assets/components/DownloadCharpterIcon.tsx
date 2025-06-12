import React from 'react';
import Svg, { G, Line, Defs, ClipPath, Circle, Path } from 'react-native-svg';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import SimpleSVGSpinner from './AnimateSpinner';

type Props = {
  downloaded?: boolean;
  isDownloading?: boolean;
  size?: number;
};

export default function DownloadChapterIcon({ downloaded = false, isDownloading = false, size = 24 }: Readonly<Props>) {
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fillColor = isDark ? '#FFF' : '#333';
  if (isDownloading) {
    return (
        <SimpleSVGSpinner size={size} />
    );
  }

  return downloaded ? (
<Svg x="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 10.443 10.534">
  <G transform="translate(-8.76 -6.706)">
    <Line
      x2="3"
      y2="2.091"
      transform="translate(10.5 13.409)"
      stroke="#FF3E91"
      strokeWidth="1" 
      strokeLinecap="round"
    />
    <Line
      x1="4"
      y2="7.091"
      transform="translate(13.5 8.409)"
      stroke="#FF3E91"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </G>
</Svg>
  ) : (
    <Svg x="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="clip-path">
          <Circle cx="12" cy="12" r="12" fill="#fff" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-path)">
        <G transform="translate(4.092 3.41)" opacity="0.669">
          <Path
            d="M9.954,11.226a.493.493,0,0,1-.357-.153L6.137,7.449a.5.5,0,0,1,.357-.836H8.306V2.824A.825.825,0,0,1,9.13,2h1.648a.825.825,0,0,1,.824.824V6.613h1.812a.5.5,0,0,1,.357.836l-3.46,3.625A.493.493,0,0,1,9.954,11.226Z"
            transform="translate(-2.046)"
            fill={fillColor}
          />
          <Path
            d="M14.663,20.636H1.153A1.155,1.155,0,0,1,0,19.483v-.33A1.155,1.155,0,0,1,1.153,18h13.51a1.155,1.155,0,0,1,1.153,1.153v.33A1.155,1.155,0,0,1,14.663,20.636Z"
            transform="translate(0 -5.456)"
            fill={fillColor}
          />
        </G>
      </G>
    </Svg>
  );
}
