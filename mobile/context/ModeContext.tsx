import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Mode = 'light' | 'dark';

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
  initialMode?: Mode;
}

export function ModeProvider({ children, initialMode = 'dark' }: ModeProviderProps) {
  const [mode, setMode] = useState<Mode>(initialMode);

  // For web or mobile, persistence handled in platform-specific wrappers

  const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
