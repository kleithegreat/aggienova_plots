import { useSelectedSNe } from "../contexts/SelectedSNeContext";
import { usePlotSettings } from "../contexts/PlotSettingsContext";
import { Paper } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, });

interface PlotData {
  x: number[];
  y: number[];
  error_y: {
    type: "data";
    array: number[];
    visible: boolean;
  };
  mode: "markers" | "lines" | "lines+markers";
  name: string;
  connectgaps: boolean;
}

const PlotComponent: React.FC = () => {
  const { selectedSNe } = useSelectedSNe();
  const { xAxisType, yAxisType, plotType, firstColor, secondColor } = usePlotSettings();
  const [plotData, setPlotData] = useState<PlotData[]>([]);

  useEffect(() => {
    setPlotData([]);
    const fetchData = async () => {
      try {
        const { data: filterTypes = [] } = await supabase.from("filters").select("*");
        const filterTypeDict = (filterTypes || []).reduce(
          (acc, { filter_id, filter_name }) => ({ ...acc, [filter_id]: filter_name }), 
          {}
        );

        try {
          const { data: lightCurves = [] } = await supabase
            .from("light_curves")
            .select("*")
            .in("sn_id", selectedSNe.map(({ sn_id }) => sn_id));

          const lightCurvesDict = lightCurves?.reduce((acc, curve) => {
            if (!acc[curve.sn_id]) acc[curve.sn_id] = {};
            if (!acc[curve.sn_id][curve.filter_id]) acc[curve.sn_id][curve.filter_id] = [];
            acc[curve.sn_id][curve.filter_id].push(curve);
            return acc;
          }, {});  // { sn_id: { filter_id: [light_curve] } }

          if (plotType === "magnitude") {
            for (const sn of selectedSNe) {
              for (const [filterID, filterName] of Object.entries(filterTypeDict)) {
                if (!lightCurvesDict[sn.sn_id]?.[filterID]) continue;
            
                let combinedData = [];
            
                for (const curve of lightCurvesDict[sn.sn_id][filterID]) {
                  combinedData.push({
                    x: curve.mjd,
                    y: curve.magnitude || NaN,
                    errorY: curve.magnitude_error || NaN
                  });
                }
            
                if (xAxisType === "dsfo") {
                  const minX = Math.min(...combinedData.map(data => data.x));
                  combinedData = combinedData.map(data => ({ ...data, x: data.x - minX }));
                }
            
                if (yAxisType === "absolute") {
                  combinedData = combinedData.map(data => ({
                    ...data,
                    y: sn.distance_modulus !== null ? data.y - sn.distance_modulus : data.y
                  }));
                }
            
                combinedData.sort((a, b) => a.x - b.x);
            
                let x = combinedData.map(data => data.x);
                let y = combinedData.map(data => data.y);
                let errorY = combinedData.map(data => data.errorY);
            
                setPlotData((prev) => [
                  ...prev,
                  {
                    x,
                    y,
                    error_y: {
                      type: "data",
                      array: errorY,
                      visible: true,
                    },
                    mode: "lines+markers",
                    name: `${sn.sn_name} (${filterName})`,
                    connectgaps: false,
                  },
                ]);
              }
            }
            
          } else { // plotType === "color"
            console.log("lmfao");
            for (const sn of selectedSNe) {
              // compute colors using firstColor - secondColor
              
            }
          }
        } catch (error) { console.error("Error fetching light curves in PlotComponent: ", error); }
      } catch (error) { console.error("Error fetching filters in PlotComponent: ", error); }
    };
    fetchData();
  }, [selectedSNe, xAxisType, yAxisType, plotType, firstColor, secondColor]);

  return (
    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <Plot
        data={plotData}
        layout={{
          xaxis: {
            title: xAxisType === "dsfo" ? "Days since first observation" : "Modified Julian Date",
            autorange: true,
          },
          yaxis: {
            title: yAxisType === "absolute" ? "Absolute Magnitude" : "Apparent Magnitude",
            autorange: "reversed"
          },
          autosize: true,
          margin: { l: 50, r: 50, b: 50, t: 50, pad: 5 },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'hoverCompareCartesian', 'hoverClosestCartesian', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d'],
          modeBarButtonsToAdd: [
            // Add custom buttons as necessary
          ],
        }}
        style={{ width: '100%', flexGrow: 1 }}
      />
    </Paper>
  );
};

export default PlotComponent;