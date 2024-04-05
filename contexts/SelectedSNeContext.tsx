import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Supernova } from '../lib/index';

interface SelectedSNeContextType {
  selectedSNe: Supernova[];
  setSelectedSNe: React.Dispatch<React.SetStateAction<Supernova[]>>;
}

interface SelectedSNeProviderProps {
    children: ReactNode;
}

const SelectedSNeContext = createContext<SelectedSNeContextType | undefined>(undefined);

export const useSelectedSNe = () => {
  const context = useContext(SelectedSNeContext);
  if (!context) {
    throw new Error('useSelectedSNe must be used within a SelectedSNeProvider');
  }
  return context;
};

export const SelectedSNeProvider: React.FC<SelectedSNeProviderProps> = ({ children }) => {
  const [selectedSNe, setSelectedSNe] = useState<Supernova[]>([]);

  return (
    <SelectedSNeContext.Provider value={{ selectedSNe, setSelectedSNe }}>
      {children}
    </SelectedSNeContext.Provider>
  );
};