import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import Button from '@mui/material/Button';

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
    }

    return (
        <Button
          sx={{
            backgroundColor: '#f44336 !important', // Red color
            color: 'white', // White text color
            '&:hover': {
              backgroundColor: '#d32f2f !important', // Slightly deeper red on hover
            },
          }}
          onClick={handleReset}
        >
          Reset
        </Button>
    );
}

export default ResetButton;