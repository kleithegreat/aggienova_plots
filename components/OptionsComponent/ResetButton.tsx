import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";

const ResetButton: React.FC = () => {
  const { setSelectedSNe } = useSelectedSNe();
  const { setXAxisType, setYAxisType, setPlotType, setFirstColor, setSecondColor } = usePlotSettings();

  const handleReset = () => {
    setSelectedSNe([]);
    setXAxisType("mjd");
    setYAxisType("apparent");
    setPlotType("magnitude");
    setFirstColor("B");
    setSecondColor("B");
  };

  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      onClick={handleReset}
    >
      Reset
    </button>
  );
};

export default ResetButton;