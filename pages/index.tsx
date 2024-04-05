import React from 'react';
import { Grid } from '@mui/material';
import PlotComponent from "../components/PlotComponent";
import OptionsComponent from "../components/OptionsComponent/OptionsComponent";

const Home: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <PlotComponent />
      </Grid>
      <Grid item xs={4}>
        <OptionsComponent />
      </Grid>
    </Grid>
  );
};

export default Home;