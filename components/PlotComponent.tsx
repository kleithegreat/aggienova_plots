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
  const [currentLightCurves, setCurrentLightCurves] = useState<LightCurve[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (plotType === "magnitude") {
        const { data, error } = await supabase
          .from("light_curves")
          .select("*")
          .in("sn_id", selectedSNe.map((sn) => sn.sn_id));
        
        if (error) {
          console.error("Error fetching light curves in PlotComponent: ", error);
        } else {
          setCurrentLightCurves(data || []);
        }
        // adjust if dsfo
        // adjust if absolute mag
        
      } else {
        // Implement color plot later
        console.log("lmao");
      }
    };

    fetchData();
  }, [selectedSNe, xAxisType, yAxisType, plotType, firstColor, secondColor]);

  return (
    <Paper elevation={3} sx={{ padding: 2, width: "100%", minHeight: "calc(100vh - 32px)" }}>
      <Plot />
    </Paper>
  );
};

export default PlotComponent;