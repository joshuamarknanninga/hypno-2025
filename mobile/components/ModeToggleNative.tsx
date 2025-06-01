import React from 'react';
import { Button } from 'react-native';
import { useMode } from '../../shared/context/ModeContext';

export default function ModeToggleNative() {
  const { mode, toggleMode } = useMode();

  return (
    <Button
      title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
      onPress={toggleMode}
    />
  );
}
