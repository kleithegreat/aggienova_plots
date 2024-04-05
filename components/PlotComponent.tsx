import { useSelectedSNe } from "../contexts/SelectedSNeContext";
import { usePlotSettings } from '../contexts/PlotSettingsContext';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

const PlotComponent:React.FC = () => {
    const { selectedSNe } = useSelectedSNe();
    const { xAxisType, yAxisType, plotType, firstColor, secondColor } = usePlotSettings();

    return (
        <div></div>
    )
}

export default PlotComponent;