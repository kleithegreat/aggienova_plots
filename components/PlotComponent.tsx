import { useSelectedSNe } from "../contexts/SelectedSNeContext";
import { usePlotSettings } from "../contexts/PlotSettingsContext";
import { Paper } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { LightCurve, Supernova } from "../lib";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, });

const PlotComponent: React.FC = () => {
  const { selectedSNe } = useSelectedSNe();
  const { xAxisType, yAxisType, plotType, firstColor, secondColor } = usePlotSettings();
  const [plotData, setPlotData] = useState<Array<{ x: number[]; y: number[]; type: "scatter"; mode: "lines"; name: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (plotType === "magnitude") {
        const newPlotData = await Promise.all(
          selectedSNe.map(async (sn) => {
            const { data: lightCurves, error: lcError } = await supabase
              .from("light_curves")
              .select("*")
              .eq("sn_id", sn.sn_id);

            if (lcError) {
              console.error("Error fetching light curves: ", lcError);
              return null;
            }

            let x = lightCurves?.map((lc) => lc.mjd) || [];
            let y = lightCurves?.map((lc) => lc.magnitude || 0) || [];

            if (xAxisType === "dsfo") {
              const firstObservation = Math.min(...x);
              x = x.map((mjd) => mjd - firstObservation);
            }

            if (yAxisType === "absolute") {
              const { data: supernova, error: snError } = await supabase
                .from("supernovae")
                .select("distance_modulus")
                .eq("sn_id", sn.sn_id)
                .single();

              if (snError) {
                console.error("Error fetching supernova: ", snError);
                return null;
              }

              const distanceModulus = supernova?.distance_modulus || 0;
              y = y.map((mag) => (mag || 0) - distanceModulus);
            }

            return {
              x,
              y,
              type: "scatter",
              mode: "lines+markers",
              name: sn.sn_name,
            };
          })
        );

        setPlotData(newPlotData.filter((pd) => pd !== null) as typeof plotData);
      } else {
        // Implement color plot later
      }
    };

    fetchData();
  }, [selectedSNe, xAxisType, yAxisType, plotType]);

  return (
    <Paper elevation={3} sx={{ padding: 2, width: "100%", minHeight: "calc(100vh - 32px)" }}>
      <Plot data={plotData} layout={{ xaxis: { title: xAxisType }, yaxis: { title: yAxisType } }} />
    </Paper>
  );
};

export default PlotComponent;