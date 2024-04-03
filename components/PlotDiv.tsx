import React, { useEffect, useState } from 'react';
import { Supernova, Filter, LightCurve } from '../types';
import { supabase } from '../lib/supabase';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })
// import {PlotParams} from 'react-plotly.js';

interface PlotDivProps {
  selectedSupernovae: Supernova[];
  selectedFilters: Filter[];
}

const PlotDiv: React.FC<PlotDivProps> = ({ selectedSupernovae, selectedFilters }) => {
  const [data, setData] = useState<Plotly.Data[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: lightCurves, error } = await supabase
        .from<string, LightCurve>('light_curves')
        .select('*')
        .in('sn_id', selectedSupernovae.map((sn) => sn.sn_id))
        .in('filter_id', selectedFilters.map((filter) => filter.filter_id));

      if (error) {
        console.error('Error fetching light curves:', error);
        return;
      }

      // Process the data and create the plot traces
      const traces = selectedSupernovae.map((sn) => {
        const snLightCurves = lightCurves?.filter((lc) => lc.sn_id === sn.sn_id);

        return selectedFilters.map((filter) => {
          const filterLightCurves = snLightCurves?.filter((lc) => lc.filter_id === filter.filter_id);

          return {
            x: filterLightCurves?.map((lc) => lc.mjd),
            y: filterLightCurves?.map((lc) => lc.magnitude),
            error_y: {
              type: 'data',
              array: filterLightCurves?.map((lc) => lc.magnitude_error || 0),
              visible: true,
            },
            mode: 'lines+markers',
            name: `${sn.sn_name} - ${filter.filter_name}`,
          };
        });
      }).flat();

      setData(traces);
    };

    fetchData();
  }, [selectedSupernovae, selectedFilters]);

  return (
    <Plot
      data={data}
      layout={{
        title: 'Supernovae Light Curves',
        xaxis: { title: 'Modified Julian Date' },
        yaxis: { title: 'Magnitude', autorange: 'reversed' },
        width: 800,
        height: 600,
      }}
    />
  );
};

export default PlotDiv;