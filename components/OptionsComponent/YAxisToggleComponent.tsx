import React, { useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

interface YAxisToggleComponentProps {
  onNoData: (message: string) => void;
}

const YAxisToggleComponent: React.FC<YAxisToggleComponentProps> = ({ onNoData }) => {
  const { yAxisType, setYAxisType } = usePlotSettings();
  const { selectedSNe, setSelectedSNe } = useSelectedSNe();

  useEffect(() => {
    if (yAxisType === "absolute") {
      const filteredSNe = selectedSNe.filter((sn) => sn.distance_modulus !== null);
      const removedSNe = selectedSNe.filter((sn) => sn.distance_modulus === null);

      if (removedSNe.length > 0) {
        const snNames = removedSNe.map((sn) => sn.sn_name).join(", ");
        onNoData(`The following supernovae have been removed due to missing distance modulus: ${snNames}`);
      }

      setSelectedSNe(filteredSNe);
    }
  }, [yAxisType, selectedSNe, setSelectedSNe, onNoData]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newYAxisType: string | null
  ) => {
    if (newYAxisType !== null) {
      setYAxisType(newYAxisType as "apparent" | "absolute");
    }
  };

  return (
    <ToggleButtonGroup
      value={yAxisType}
      exclusive
      onChange={handleChange}
      aria-label="y-axis type"
      size="small"
    >
      <ToggleButton value="apparent" aria-label="apparent">
        Apparent
      </ToggleButton>
      <ToggleButton value="absolute" aria-label="absolute">
        Absolute
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default YAxisToggleComponent;
