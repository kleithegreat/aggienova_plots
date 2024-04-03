import React from 'react';
import { Supernova, SupernovaType } from '../types';
import { supabase } from '../lib/supabase';

interface SupernovaeSelectionProps {
  supernovae: Supernova[];
  supernovaTypes: SupernovaType[];
  selectedSupernovae: Supernova[];
  setSelectedSupernovae: (supernovae: Supernova[]) => void;
}

const SupernovaeSelection: React.FC<SupernovaeSelectionProps> = ({
  supernovae,
  supernovaTypes,
  selectedSupernovae,
  setSelectedSupernovae,
}) => {
  const handleSupernovaSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSn = supernovae.find((sn) => sn.sn_name === e.target.value);
    if (selectedSn) {
      setSelectedSupernovae([...selectedSupernovae, selectedSn]);
    }
  };

  const handleSupernovaRemoval = (snToRemove: Supernova) => {
    setSelectedSupernovae(selectedSupernovae.filter((sn) => sn.sn_id !== snToRemove.sn_id));
  };

  const handleSupernovaTypeSelection = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = supernovaTypes.find((type) => type.type_name === e.target.value);
    if (selectedType) {
      const { data: supernovaeByType, error } = await supabase
        .from<string, Supernova>('supernovae')
        .select('*')
        .eq('type_id', selectedType.type_id);
  
      if (error) {
        console.error('Error fetching supernovae by type:', error);
      } else {
        setSelectedSupernovae([...selectedSupernovae, ...(supernovaeByType || [])]);
      }
    }
  };

  return (
    <div>
      <h2>Select Supernovae</h2>
      <select onChange={handleSupernovaSelection}>
        <option value="">Select a Supernova</option>
        {supernovae.map((sn) => (
          <option key={sn.sn_id} value={sn.sn_name}>
            {sn.sn_name}
          </option>
        ))}
      </select>
      <select onChange={handleSupernovaTypeSelection}>
        <option value="">Select a Supernova Type</option>
        {supernovaTypes.map((type) => (
          <option key={type.type_id} value={type.type_name}>
            {type.type_name}
          </option>
        ))}
      </select>
      <ul>
        {selectedSupernovae.map((sn) => (
          <li key={sn.sn_id}>
            {sn.sn_name}{' '}
            <button onClick={() => handleSupernovaRemoval(sn)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupernovaeSelection;