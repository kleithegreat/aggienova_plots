import { useState, useEffect } from "react";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import Switch from "@mui/material/Switch";

interface YAxisToggleComponentProps {
  onNoData: (message: string) => void;
}

const YAxisToggleComponent: React.FC<YAxisToggleComponentProps> = ({ onNoData }) => {
  const { yAxisType, setYAxisType } = usePlotSettings();
  const { selectedSNe, setSelectedSNe } = useSelectedSNe();
  const [checked, setChecked] = useState(yAxisType === "absolute");

  useEffect(() => {
    setChecked(yAxisType === "absolute");
  }, [yAxisType]);

  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (newChecked) {
      // Toggling from apparent to absolute
      const filteredSNe = selectedSNe.filter((sn) => sn.distance_modulus !== null);
      const removedSNe = selectedSNe.filter((sn) => sn.distance_modulus === null);

      if (removedSNe.length > 0) {
        const snNames = removedSNe.map((sn) => sn.sn_name).join(", ");
        onNoData(`The following supernovae have been removed due to missing distance modulus: ${snNames}`);
      }

      setSelectedSNe(filteredSNe);
      setYAxisType("absolute");
    } else {
      // Toggling from absolute to apparent
      setYAxisType("apparent");
    }
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