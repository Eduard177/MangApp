import React from 'react';
import Svg, { Path, Line, G } from 'react-native-svg';

type Props = {
  downloaded?: boolean;
  size?: number;
};

export default function DownloadFullIcon({ downloaded = false, size = 30 }: Readonly<Props>) {
  return (
    <Svg
      width={size}
      height={(size * 19.818) / 29.643} // mantiene proporción original
      viewBox="0 0 29.643 19.818"
    >
      <Path
        d="M23.906,13.808a9.254,9.254,0,0,0-17.3-2.477,7.433,7.433,0,0,0,.8,14.82H23.467a6.179,6.179,0,0,0,.439-12.343Z"
        transform="translate(0 -6.333)"
        fill="#fff"
        stroke="black"
        strokeWidth="1"
      />

      {!downloaded && (
        <Path
          d="M14.822,23.674L8.646,17.481h3.705V12.526h4.94v4.954H21Z"
          transform="translate(0 -6.333)"
          fill="#000"
          stroke="black"
          strokeWidth="1"
        />
      )}  

      {downloaded && (
        <G transform="translate(0 -1)">
          <Line
            x1="3"
            y1="2.091"
            transform="translate(10.5 13.409)"
            stroke="#FF3E91"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Line
            x1="4"
            y2="7.091"
            transform="translate(13.5 8.409)"
            stroke="#FF3E91"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </G>
      )}
    </Svg>
  );
}
