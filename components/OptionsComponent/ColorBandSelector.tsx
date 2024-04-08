import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import type { ColorOption } from "../../contexts/PlotSettingsContext";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const ColorBandSelector: React.FC = () => {
  const { firstColor, setFirstColor, secondColor, setSecondColor } = usePlotSettings();
  const colorOptions: ColorOption[] = ["U", "V", "B", "UVW1", "UVW2", "UVM2"];
  
  const handleFirstColorChange = (event: SelectChangeEvent<ColorOption>) => {
      setFirstColor(event.target.value as ColorOption);
  };

  const handleSecondColorChange = (event: SelectChangeEvent<ColorOption>) => {
      setSecondColor(event.target.value as ColorOption);
  };

  return (
    <div className="flex items-center space-x-2">
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="first-color-label">First Filter</InputLabel>
        <Select
          labelId="first-color-label"
          id="first-color-select"
          value={firstColor}
          label="First Color"
          onChange={handleFirstColorChange}
        >
          {colorOptions.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <span>-</span>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="second-color-label">Second Filter</InputLabel>
        <Select
          labelId="second-color-label"
          id="second-color-select"
          value={secondColor}
          label="Second Color"
          onChange={handleSecondColorChange}
        >
          {colorOptions.map((color) => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ColorBandSelector;