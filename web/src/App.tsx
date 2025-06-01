import React from 'react';
import { WebModeProvider } from './context/ModeContextWeb';
import CrtCanvasWeb from './components/CrtCanvasWeb';
import AmbientSoundWrapper from './components/AmbientSoundWrapper';

export default function App() {
  return (
    <WebModeProvider>
      <AmbientSoundWrapper />
      <CrtCanvasWeb />
    </WebModeProvider>
  );
}
