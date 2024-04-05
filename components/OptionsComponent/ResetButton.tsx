import { useSelectedSNe } from "../../contexts/SelectedSNeContext";
import { usePlotSettings } from "../../contexts/PlotSettingsContext";
import { Button } from "react-bootstrap";

const ResetButton:React.FC = () => {
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
        <Button variant="danger" onClick={handleReset}>Reset</Button>
    )
}

export default ResetButton;