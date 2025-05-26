import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Circle } from 'react-native-svg';

export default function ExploreIcon({ fill = "#FF3E91" }) {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Defs>
        <ClipPath id="clip-path">
          <Circle cx="15" cy="15" r="15" fill={fill} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip-path)">
        <G transform="translate(4, 4)">
          <Path
            d="M11.152 0A11.151 11.151 0 1 0 22.3 11.151 11.149 11.149 0 0 0 11.152 0Zm2.442 13.593-9.133 4.249L8.709 8.709l9.133-4.249Z"
            fill={fill}
          />
          <Path
            d="M16.357 17.583a1.227 1.227 0 1 0-1.227-1.227 1.227 1.227 0 0 0 1.227 1.227Z"
            fill={fill}
          />
        </G>
      </G>
    </Svg>
  );
}
