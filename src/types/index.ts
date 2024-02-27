// src/types/index.ts

export interface Supernova {
  sn_id: number;
  sn_name: string;
  activeFilters: number[];
  includedInPlot: boolean;
}

export interface SupernovaContextType {
  selectedSupernovae: Supernova[];
  addSupernova: (supernova: Supernova) => void;
  removeSupernova: (sn_id: number) => void;
  toggleFilter: (sn_id: number, filter_id: number) => void;
}
