import React from 'react';
import { Paper, Grid } from '@mui/material';
import SNeNameSearch from './SNeNameSearch';
import TypeSearch from './TypeSearch';
import SNePlotList from './SNePlotList';
import XAxisToggleComponent from './XAxisToggleComponent';
import YAxisToggleComponent from './YAxisToggleComponent';
import PlotTypeToggleComponent from './PlotTypeToggleComponent';
import ColorBandSelector from './ColorBandSelector';
import ResetButton from './ResetButton';

const OptionsComponent: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ padding: 2, width: '100%', minHeight: 'calc(100vh - 32px)' }}>
      <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ minWidth: 320 }}>
        <Grid item sx={{ width: '100%' }}>
          <SNeNameSearch />
        </Grid>
        <Grid item sx={{ width: '100%' }}>
          <TypeSearch />
        </Grid>
        <Grid item>
          <XAxisToggleComponent />
        </Grid>
        <Grid item>
          <YAxisToggleComponent />
        </Grid>
        <Grid item>
          <PlotTypeToggleComponent />
        </Grid>
        <Grid item>
          <ColorBandSelector />
        </Grid>
        <Grid item>
          <SNePlotList />
        </Grid>
        <Grid item>
          <ResetButton />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OptionsComponent;
