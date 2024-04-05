import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import type { ColorOption } from "../../contexts/PlotSettingsContext";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ColorBandSelector: React.FC = () => {
  const { firstColor, setFirstColor, secondColor, setSecondColor } = usePlotSettings();
  const colorOptions: ColorOption[] = ["U", "V", "B", "UVW1", "UVW2", "UVM2"];

  return (
    <div className="flex items-center space-x-2">
      <span>color bands</span>
      <Select
        value={firstColor}
        onChange={(e) => setFirstColor(e.target.value as ColorOption)}
        className="rounded-none bg-transparent"
      >
        {colorOptions.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </Select>
      <span>-</span>
      <Select
        value={secondColor}
        onChange={(e) => setSecondColor(e.target.value as ColorOption)}
        className="rounded-none bg-transparent"
      >
        {colorOptions.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default ColorBandSelector;
