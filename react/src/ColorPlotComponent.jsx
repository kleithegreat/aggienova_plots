import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function ColorPlotComponent({ supernovae, band1, band2, highlighted }) {
    const [plotData, setPlotData] = useState({ data: [], layout: {} });
    const [error, setError] = useState('');

    useEffect(() => {
        const updateColorPlot = async () => {
            setError('');
            try {
                const response = await fetch('http://localhost:5000/plot_colors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    body: JSON.stringify({
                        selectedSupernovae: supernovae,
                        band1: band1,
                        band2: band2,
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
                console.error("ColorPlotResponse error:", error);
            }
        }

        updateColorPlot();
    }, [supernovae, band1, band2, highlighted]);

    return (
        <div className="ColorPlotComponent">
            {error && <div>Error: {error}</div>}
            <Plot
                data={plotData.data}
                layout={plotData.layout}
            />
        </div>
    );
};

export default ColorPlotComponent;
