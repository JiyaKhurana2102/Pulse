import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface SearchIconProps {
  size: number;
  color: string;
  filled?: boolean;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ size, color, filled = false }) => {
  if (filled) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" fill={color} />
        <Circle cx="11" cy="11" r="5.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <Path
          d="M17 17L22 22"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path
        d="M17 17L22 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};
