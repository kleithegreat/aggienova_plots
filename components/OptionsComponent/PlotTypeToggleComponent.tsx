import { useState, useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import Switch from "@mui/material/Switch";

const PlotTypeToggleComponent: React.FC = () => {
  const { plotType, setPlotType } = usePlotSettings();
  const [checked, setChecked] = useState(plotType === "color");

  useEffect(() => {
    setChecked(plotType === "color");
  }, [plotType]);

  const handleChange = () => {
    setChecked(!checked);
    setPlotType(checked ? "magnitude" : "color");
  };

  return (
    <div className="flex items-center">
      <span className={`mr-2 ${checked ? 'text-gray-400' : 'text-black'}`}>magnitude</span>
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
        sx={{
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              '& + .MuiSwitch-track': {
                backgroundColor: '#1976d2',
              },
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.26)',
            opacity: 1,
          },
        }}
      />
      <span className={`ml-2 ${checked ? 'text-black' : 'text-gray-400'}`}>color</span>
    </div>
  );
};

export default PlotTypeToggleComponent;