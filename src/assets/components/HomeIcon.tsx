import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Circle } from 'react-native-svg';

export default function HomeIcon({ fill = '#FF3E91' }) {
  return (
    <Svg width="40" height="40" viewBox="0 0 30 30" fill="none">
      <Defs>
        <ClipPath id="clip-path">
          <Circle cx="15" cy="15" r="15" transform="translate(0.281 0.602)" fill={fill} />
        </ClipPath>
      </Defs>
      <G transform="translate(-0.281 -0.602)" clipPath="url(#clip-path)">
        <Path
          d="M22.088,9.874l0,0L12.827.612a2.089,2.089,0,0,0-2.955,0L.616,9.867l-.009.01A2.089,2.089,0,0,0,2,13.437q.032,0,.064,0h.369v6.815A2.449,2.449,0,0,0,4.877,22.7H8.5a.665.665,0,0,0,.665-.665V16.693a1.117,1.117,0,0,1,1.116-1.116h2.137a1.117,1.117,0,0,1,1.116,1.116v5.343a.665.665,0,0,0,.665.665h3.623a2.449,2.449,0,0,0,2.446-2.446V13.44h.342a2.09,2.09,0,0,0,1.479-3.567Z"
          transform="translate(4.281 4.602)"
          fill={fill}
        />
      </G>
    </Svg>
  );
}
