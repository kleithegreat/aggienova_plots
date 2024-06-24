import React from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { FormGroup, FormControlLabel, Checkbox, Box } from "@mui/material";

const FilterSelect: React.FC = () => {
  const { selectedFilters, setSelectedFilters } = usePlotSettings();
  const filterOptions = ["U", "V", "B", "UVW1", "UVW2", "UVM2"] as const;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filter = event.target.name as typeof filterOptions[number];
    setSelectedFilters(prev => 
      event.target.checked
        ? [...prev, filter]
        : prev.filter(f => f !== filter)
    );
  };

  return (
    <Box display="flex" justifyContent="flex-start">
      <FormGroup>
        {filterOptions.slice(0, 3).map((filter) => (
          <FormControlLabel
            key={filter}
            control={
              <Checkbox
                checked={selectedFilters.includes(filter)}
                onChange={handleFilterChange}
                name={filter}
              />
            }
            label={filter}
          />
        ))}
      </FormGroup>
      <FormGroup sx={{ ml: 4 }}>  {/* Add some margin to separate the columns */}
        {filterOptions.slice(3).map((filter) => (
          <FormControlLabel
            key={filter}
            control={
              <Checkbox
                checked={selectedFilters.includes(filter)}
                onChange={handleFilterChange}
                name={filter}
              />
            }
            label={filter}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default FilterSelect;
