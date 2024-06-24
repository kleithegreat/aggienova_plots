import React from 'react';
import { Paper } from '@mui/material';
import SNeNameSearch from './SNeNameSearch';
import TypeSearch from './TypeSearch';
import SNePlotList from './SNePlotList';
import XAxisToggleComponent from './XAxisToggleComponent';
import YAxisToggleComponent from './YAxisToggleComponent';
import PlotTypeToggleComponent from './PlotTypeToggleComponent';
import ColorBandSelector from './ColorBandSelector';
import FilterSelect from './FilterSelect';
import ResetButton from './ResetButton';
import { usePlotSettings } from "../../contexts/PlotSettingsContext";

interface OptionsComponentProps {
  onNoData: (message: string) => void;
}

const OptionsComponent: React.FC<OptionsComponentProps> = ({ onNoData }) => {
  const { plotType } = usePlotSettings();

  return (
    <Paper elevation={3} className="p-4 w-full min-h-[calc(100vh-32px)]">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full">
          <SNeNameSearch onNoData={onNoData} />
        </div>
        <div className="w-full">
          <TypeSearch onNoData={onNoData} />
        </div>
        <div>
          <XAxisToggleComponent />
        </div>
        <div>
          <YAxisToggleComponent onNoData={onNoData} />
        </div>
        <div>
          <PlotTypeToggleComponent />
        </div>
        <div>
          {plotType === 'color' ? <ColorBandSelector /> : <FilterSelect />}
        </div>
        <div>
          <SNePlotList />
        </div>
        <div>
          <ResetButton />
        </div>
      </div>
    </Paper>
  );
};

export default OptionsComponent;
