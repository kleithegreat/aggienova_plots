import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Supernova, SupernovaContextType } from '../types';

const SupernovaContext = createContext<SupernovaContextType | undefined>(undefined);

interface SupernovaProviderProps {
  children: ReactNode; // Add this line to define the type for children
}

export const SupernovaProvider: React.FC<SupernovaProviderProps> = ({ children }) => {
  const [selectedSupernovae, setSelectedSupernovae] = useState<Supernova[]>([]);

  const addSupernova = (supernova: Supernova) => {
    setSelectedSupernovae((prevSupernovae) => [...prevSupernovae, supernova]);
  };

  const removeSupernova = (sn_id: number) => {
    setSelectedSupernovae((prevSupernovae) => prevSupernovae.filter(s => s.sn_id !== sn_id));
  };

  const toggleFilter = (sn_id: number, filter_id: number) => {
    setSelectedSupernovae((prevSupernovae) =>
      prevSupernovae.map((s) =>
        s.sn_id === sn_id
          ? { ...s, activeFilters: s.activeFilters.includes(filter_id) ? s.activeFilters.filter(f => f !== filter_id) : [...s.activeFilters, filter_id] }
          : s
      )
    );
  };

  return (
    <SupernovaContext.Provider value={{ selectedSupernovae, addSupernova, removeSupernova, toggleFilter }}>
      {children}
    </SupernovaContext.Provider>
  );
};
