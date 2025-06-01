import React, { useEffect, ReactNode } from 'react';
import { ModeProvider, useMode, Mode } from '../../../shared/context/ModeContext';

interface WebModeProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'crtMode';

export function WebModeProvider({ children }: WebModeProviderProps) {
  const [storedMode, setStoredMode] = React.useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Sync localStorage with mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, storedMode);
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${storedMode}-mode`);
    }
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
