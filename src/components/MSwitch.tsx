import React from 'react';
import { Switch } from 'react-native';

interface MSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function MSwitch({
  value,
  onValueChange,
  disabled = false,
}: Readonly<MSwitchProps>) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#B4B4B4', true: '#F8BBD5' }}
      thumbColor={value ? '#FF3E91' : '#B4B4B4'}
      ios_backgroundColor="#FFFFFF"
    />
  );
}
