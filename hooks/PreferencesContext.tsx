import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Preferences {
  brightness: number; // 0.5 (dim) to 1.5 (bright)
  zoom: number; // 1 = normal, >1 = zoom in, <1 = zoom out
  setBrightness: (value: number) => void;
  setZoom: (value: number) => void;
}

const PreferencesContext = createContext<Preferences | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [brightness, setBrightness] = useState(1);
  const [zoom, setZoom] = useState(1);

  return (
    <PreferencesContext.Provider value={{ brightness, zoom, setBrightness, setZoom }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
};
