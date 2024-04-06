import React from 'react';
import { Grid } from '@mui/material';
import PlotComponent from "../components/PlotComponent";
import OptionsComponent from "../components/OptionsComponent/OptionsComponent";

const Home: React.FC = () => {
  return (
    <div>
      <Grid container>
        <Grid item xs={9} className="pt-4 pl-4 pb-4 pr-2">
          <PlotComponent />
        </Grid>
        <Grid item xs={3} className="pt-4 pr-4 pb-4 pl-2">
          <OptionsComponent />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;