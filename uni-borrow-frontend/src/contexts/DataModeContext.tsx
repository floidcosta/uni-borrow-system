import React, { createContext, useContext, useEffect, useState } from 'react';

type DataMode = 'mock' | 'live';

interface DataModeContextType {
  mode: DataMode;
  setMode: (m: DataMode) => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

const STORAGE_KEY = 'dataMode';

export const DataModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<DataMode>('mock');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as DataMode | null;
    if (stored === 'mock' || stored === 'live') setModeState(stored);
  }, []);

  const setMode = (m: DataMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  return (
    <DataModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error('useDataMode must be used within DataModeProvider');
  return ctx;
};

export type { DataMode };
