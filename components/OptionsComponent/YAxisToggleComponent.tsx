import { useState, useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import Switch from "@mui/material/Switch";

const YAxisToggleComponent: React.FC = () => {
  const { yAxisType, setYAxisType } = usePlotSettings();
  const [checked, setChecked] = useState(yAxisType === "absolute");

  useEffect(() => {
    setChecked(yAxisType === "absolute");
  }, [yAxisType]);

  const handleChange = () => {
    setChecked(!checked);
    setYAxisType(checked ? "apparent" : "absolute");
  };

  return (
    <div className="flex items-center">
      <span className={`mr-2 ${checked ? 'text-gray-400' : 'text-black'}`}>apparent</span>
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
      <span className={`ml-2 ${checked ? 'text-black' : 'text-gray-400'}`}>absolute</span>
    </div>
  );
}

export default YAxisToggleComponent;