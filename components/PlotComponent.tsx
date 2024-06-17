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
            .in("sn_id", selectedSNe.map(({ sn_id }) => sn_id))
            .not("magnitude", "is", null);

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

                if (yAxisType === "absolute") {
                  combinedData = combinedData.map(data => ({
                    ...data,
                    y: sn.distance_modulus !== null ? data.y - sn.distance_modulus : data.y
                  }));
                }

                combinedData.sort((a, b) => a.x - b.x);

                if (xAxisType === "dsfo") {
                  const minX = Math.min(...combinedData.map(data => data.x));
                  combinedData = combinedData.map(data => ({ ...data, x: data.x - minX }));
                }

                if (xAxisType === "peak") { // find minimum magnitude for each filter and adjust all x values to be days +/- from peak
                  const minMag = Math.min(...combinedData.map(data => data.y));
                  const peakIndex = combinedData.findIndex(data => data.y === minMag);
                  const peakMJD = combinedData[peakIndex].x;
                  combinedData = combinedData.map(data => ({ ...data, x: data.x - peakMJD }));
                }
            
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
            for (const sn of selectedSNe) {
              // get filter ids of first and second color
              const firstColorID = Object.keys(filterTypeDict).find(key => filterTypeDict[key] === firstColor);
              const secondColorID = Object.keys(filterTypeDict).find(key => filterTypeDict[key] === secondColor);

              // compute colors using firstColor - secondColor
              if (!firstColorID || !secondColorID) continue;

              const firstFilterData = lightCurvesDict[sn.sn_id]?.[firstColorID];
              const secondFilterData = lightCurvesDict[sn.sn_id]?.[secondColorID];

              if (!firstFilterData || !secondFilterData) continue;

              // create combined data arrays for both filters
              const firstFilterCombinedData = firstFilterData.map((data: { mjd: any; magnitude: any; magnitude_error: any; }) => ({
                x: data.mjd,
                y: data.magnitude || NaN,
                errorY: data.magnitude_error || NaN,
              }));
              const secondFilterCombinedData = secondFilterData.map((data: { mjd: any; magnitude: any; magnitude_error: any; }) => ({
                x: data.mjd,
                y: data.magnitude || NaN,
                errorY: data.magnitude_error || NaN,
              }));

              // sort both arrays by x
              firstFilterCombinedData.sort((a: { x: number; }, b: { x: number; }) => a.x - b.x);
              secondFilterCombinedData.sort((a: { x: number; }, b: { x: number; }) => a.x - b.x);
              
              // compute color array
              const colorData = [];
              // for each x in top filter, find closest x in bottom filter within 1 day
              for (const point of firstFilterCombinedData) {
                const closestSecondPoint = secondFilterCombinedData.find(
                  (secondPoint: typeof secondFilterData[0]) => Math.abs(secondPoint.x - point.x) <= 1
                );

                // if found, compute color and add to color array and pop corresponding point from bottom filter
                if (closestSecondPoint) {
                  const color = point.y - closestSecondPoint.y;
                  // calculate propagated error
                  const errorPropagated = Math.sqrt(
                    Math.pow(point.errorY || 0, 2) + Math.pow(closestSecondPoint.errorY || 0, 2)
                  );
                  colorData.push({x: point.x, y: color, errorY: errorPropagated});
                  secondFilterCombinedData.splice(secondFilterCombinedData.indexOf(closestSecondPoint), 1);
                }
              }

              // plot color array
              if (colorData.length > 0) {
                // adjust all x values to start from 0
                const minX = Math.min(...colorData.map(data => data.x));
                const x = colorData.map(data => data.x - minX);
                const y = colorData.map(data => data.y);
                const errorY = colorData.map(data => data.errorY);

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
                    name: `${sn.sn_name} (${firstColor} - ${secondColor})`,
                    connectgaps: false,
                  },
                ]);
              } else {
                console.log("No data to plot for color plot.");
              }
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
            title: xAxisType === "dsfo" ? "Days since first observation" :
              xAxisType === "peak" ? "Days from peak magnitude" : "Modified Julian Date",
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