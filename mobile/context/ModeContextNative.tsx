import React, { useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModeProvider, useMode, Mode } from '../../shared/context/ModeContext';

interface NativeModeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'crtMode';

export function NativeModeProvider({ children }: NativeModeProviderProps) {
  const [storedMode, setStoredMode] = React.useState<Mode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark') {
        setStoredMode(value);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, storedMode);
  }, [storedMode]);

  return (
    <ModeProvider initialMode={storedMode}>
      <ModeSyncSetter setStoredMode={setStoredMode}>{children}</ModeSyncSetter>
    </ModeProvider>
  );
}

function ModeSyncSetter({ setStoredMode, children }: { setStoredMode: React.Dispatch<React.SetStateAction<Mode>>; children: ReactNode; }) {
  const { mode } = useMode();

  useEffect(() => {
    setStoredMode(mode);
  }, [mode, setStoredMode]);

  return <>{children}</>;
}
