import { useState } from 'react';

function FilterBandSelection({ band1, band2, onChange }) {
    const [allFilterBands] = useState(['U', 'B', 'V', 'UVW1', 'UVM2', 'UVW2']);

    const handleBand1Change = (event) => {
        onChange(event.target.value, band2);
    };

    const handleBand2Change = (event) => {
        onChange(band1, event.target.value);
    };

    return (
        <div className="FilterBandSelection">
            <label htmlFor="band1">Filter 1:</label>
            <select id="band1" value={band1} onChange={handleBand1Change}>
                {allFilterBands.map((band) => (
                    <option key={band} value={band}>{band}</option>
                ))}
            </select>
            <label htmlFor="band2">Filter 2:</label>
            <select id="band2" value={band2} onChange={handleBand2Change}>
                {allFilterBands.map((band) => (
                    <option key={band} value={band}>{band}</option>
                ))}
            </select>
        </div>
    );
}

export default FilterBandSelection;
