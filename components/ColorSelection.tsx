import React from 'react';
import { Filter } from '../types';

interface ColorSelectionProps {
  filters: Filter[];
  selectedFilters: Filter[];
  setSelectedFilters: (filters: Filter[]) => void;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({
  filters,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleFilterSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = filters.find((filter) => filter.filter_name === e.target.value);
    if (selectedFilter && selectedFilters.length < 2) {
      setSelectedFilters([...selectedFilters, selectedFilter]);
    }
  };

  const handleFilterRemoval = (filterToRemove: Filter) => {
    setSelectedFilters(selectedFilters.filter((filter) => filter.filter_id !== filterToRemove.filter_id));
  };

  return (
    <div>
      <h2>Select Filters for Color Calculation</h2>
      <select onChange={handleFilterSelection}>
        <option value="">Select a Filter</option>
        {filters.map((filter) => (
          <option key={filter.filter_id} value={filter.filter_name}>
            {filter.filter_name}
          </option>
        ))}
      </select>
      <ul>
        {selectedFilters.map((filter) => (
          <li key={filter.filter_id}>
            {filter.filter_name}{' '}
            <button onClick={() => handleFilterRemoval(filter)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorSelection;