import React from 'react';

function AxisToggleComponent({ xAxisType, yAxisType, onXAxisChange, onYAxisChange }) {
    
    const toggleXAxis = () => {
        onXAxisChange(xAxisType === 'MJD' ? 'DaysSince' : 'MJD');
    };

    const toggleYAxis = () => {
        onYAxisChange(yAxisType === 'Apparent' ? 'Absolute' : 'Apparent');
    };

    return (
        <div className="AxisToggleComponent">
            <div className="axis-toggle">
                <span>X-axis: </span>
                <button onClick={toggleXAxis}>
                    {xAxisType === 'MJD' ? 'Modified Julian Date' : 'Days Since First Observation'}
                </button>
            </div>
            <div className="axis-toggle">
                <span>Y-axis: </span>
                <button onClick={toggleYAxis}>
                    {yAxisType === 'Apparent' ? 'Apparent Magnitude' : 'Absolute Magnitude'}
                </button>
            </div>
        </div>
    );
}

export default AxisToggleComponent;
