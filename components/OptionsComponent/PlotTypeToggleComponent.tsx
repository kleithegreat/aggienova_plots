import React from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

const PlotTypeToggleComponent: React.FC = () => {
  const { plotType, setPlotType } = usePlotSettings();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newPlotType: string | null
  ) => {
    if (newPlotType !== null) {
      setPlotType(newPlotType as "magnitude" | "color");
    }
  };

  return (
    <ToggleButtonGroup
      value={plotType}
      exclusive
      onChange={handleChange}
      aria-label="plot type"
      size="small"
    >
      <ToggleButton value="magnitude" aria-label="magnitude">
        Magnitude
      </ToggleButton>
      <ToggleButton value="color" aria-label="color">
        Color
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PlotTypeToggleComponent;
