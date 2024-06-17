import { useState, useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { XAxisType } from "../../contexts/PlotSettingsContext";

const XAxisToggleComponent: React.FC = () => {
  const { xAxisType, setXAxisType } = usePlotSettings();
  const [selected, setSelected] = useState<XAxisType>(xAxisType);

  useEffect(() => {
    setSelected(xAxisType);
  }, [xAxisType]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: XAxisType | null
  ) => {
    if (newSelection !== null) {
      setSelected(newSelection);
      setXAxisType(newSelection);
    }
  };

  return (
    <ToggleButtonGroup
      value={selected}
      exclusive
      onChange={handleChange}
      aria-label="x-axis type"
    >
      <ToggleButton value="mjd" aria-label="mjd">
        mjd
      </ToggleButton>
      <ToggleButton value="dsfo" aria-label="dsfo">
        dsfo
      </ToggleButton>
      <ToggleButton value="peak" aria-label="peak">
        peak
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default XAxisToggleComponent;
