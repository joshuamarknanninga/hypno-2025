import React from 'react';
import { NativeModeProvider } from './context/ModeContextNative';
import CrtCanvasNative from './components/CrtCanvasNative';
import AmbientSoundWrapperNative from './components/AmbientSoundWrapperNative';

export default function App() {
  return (
    <NativeModeProvider>
      <AmbientSoundWrapperNative />
      <CrtCanvasNative />
    </NativeModeProvider>
  );
}
