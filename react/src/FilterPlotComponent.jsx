import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function FilterPlotComponent({ supernovae, axis, highlighted }) {
    const [plotData, setPlotData] = useState({ data: [], layout: {} });
    const [error, setError] = useState('');


    useEffect(() => {
        const updateFilterPlot = async () => {
            setError('');
            try {
                const response = await fetch('http://localhost:5000/plot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        selectedSupernovae: supernovae,
                        xAxisType: axis.xAxisType,
                        yAxisType: axis.yAxisType,
                        highlightedSupernovae: highlighted
                    }),                
                });
        
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
                }
        
                const data = await response.json();
                setPlotData(JSON.parse(data));
            } catch (error) {
                setError('Failed to load plot data: ' + error.message);
                console.error("FilterPlotResponse error:", error);
            }
        };

        updateFilterPlot();
        // console.log(supernovae)
    }, [supernovae, axis, highlighted]);

    return (
        <div className="FilterPlotComponent">
            {error && <div>Error: {error}</div>}
            <Plot
                data={plotData.data}
                layout={plotData.layout}
            />
        </div>
    );
}

export default FilterPlotComponent;
