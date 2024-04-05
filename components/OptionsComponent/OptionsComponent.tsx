import SNePlotList from "./SNePlotList";
import XAxisToggleComponent from "./XAxisToggleComponent";
import YAxisToggleComponent from "./YAxisToggleComponent";
import PlotTypeToggleComponent from "./PlotTypeToggleComponent";
import ColorBandSelector from "./ColorBandSelector";
import ResetButton from "./ResetButton";

const OptionsComponent: React.FC = () => {
    return (
        <div>
            <XAxisToggleComponent />
            <YAxisToggleComponent />
            <PlotTypeToggleComponent />
            <ColorBandSelector />
            <SNePlotList />
            <ResetButton />
        </div>
    )
}

export default OptionsComponent;