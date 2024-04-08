import React from 'react';
import { Grid, Snackbar, Alert, AlertProps } from '@mui/material';
import PlotComponent from "../components/PlotComponent";
import OptionsComponent from "../components/OptionsComponent/OptionsComponent";

const Home: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");

  const handleAlert = (msg: string) => {
    setAlertMsg(msg);
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={9} className="pt-4 pl-4 pb-4 pr-2">
          <PlotComponent />
        </Grid>
        <Grid item xs={3} className="pt-4 pr-4 pb-4 pl-2">
          <OptionsComponent onNoData={handleAlert} />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;