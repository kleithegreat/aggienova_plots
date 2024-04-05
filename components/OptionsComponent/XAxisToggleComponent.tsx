import { useState, useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import Switch from "@mui/material/Switch";

const XAxisToggleComponent: React.FC = () => {
  const { xAxisType, setXAxisType } = usePlotSettings();
  const [checked, setChecked] = useState(xAxisType === "dsfo");

  useEffect(() => {
    setChecked(xAxisType === "dsfo");
  }, [xAxisType]);

  const handleChange = () => {
    setChecked(!checked);
    setXAxisType(checked ? "mjd" : "dsfo");
  };

  return (
    <div className="flex items-center">
      <span className={`mr-2 ${checked ? 'text-gray-400' : 'text-black'}`}>mjd</span>
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
      <span className={`ml-2 ${checked ? 'text-black' : 'text-gray-400'}`}>dsfo</span>
    </div>
  );
};

export default XAxisToggleComponent;