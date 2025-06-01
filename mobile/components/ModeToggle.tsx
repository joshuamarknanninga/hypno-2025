import React from 'react';
import { useMode } from '../../shared/context/ModeContext';

export default function ModeToggle() {
  const { mode, toggleMode } = useMode();

  return (
    <button
      onClick={toggleMode}
      aria-label="Toggle Light/Dark Mode"
      style={{
        position: 'absolute',
        top: 10,
        right: 110,
        padding: '10px 16px',
        fontSize: '16px',
        backgroundColor: mode === 'dark' ? '#222' : '#eee',
        color: mode === 'dark' ? '#0f0' : '#020',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000,
        userSelect: 'none',
      }}
    >
      {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
