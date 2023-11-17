import { useState } from 'react';
import SupernovaSelection from './SupernovaSelection';
import FilterPlotComponent from './FilterPlotComponent';
import AxisToggleComponent from './AxisToggleComponent';
import ColorPlotComponent from './ColorPlotComponent';
import FilterBandSelection from './FilterBandSelection';
import './App.css';

function App() {
  const [selectedSupernovae, setSelectedSupernovae] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({filter1: "U", filter2: "U"});
  const [axisConfig, setAxisConfig] = useState({xAxisType: 'DaysSince', yAxisType: 'Absolute'});
  const [highlightedSupernovae /*, setHighlightedSupernovae*/] = useState([]);

  const handleSupernovaSelection = async (selectedOptions) => {
    if (selectedOptions === null) {
      setSelectedSupernovae({});
    } else {
      let newSelectedSupernovae = {};
  
      const filterRequests = selectedOptions.map(option =>
        fetch(`http://localhost:5000/get_filters/${option.value}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(filters => {
            newSelectedSupernovae[option.value] = filters;
          })
          .catch(error => {
            console.error('Fetch error:', error);
            newSelectedSupernovae[option.value] = [];
          })
      );
  
      await Promise.all(filterRequests);
      setSelectedSupernovae(newSelectedSupernovae);
    }
  };

  const handleTypeSelection = async (selectedOptions) => {
    if (selectedOptions === null) {
      return;
    } else {
      let supernovaeOfTypes = [];
      const typeRequests = selectedOptions.map(option =>
        fetch(`http://localhost:5000/get_supernovae_by_type/${option.value}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(supernovae => {
            supernovaeOfTypes.push(...supernovae);
          })
          .catch(error => {
            console.error('Fetch error:', error);
          })
      );
      await Promise.all(typeRequests);
  
      const supernovaeToRemove = Object.keys(selectedSupernovae);
      supernovaeOfTypes = supernovaeOfTypes.filter(supernova => !supernovaeToRemove.includes(supernova));
  
      const filterRequests = supernovaeOfTypes.map(supernova =>
        fetch(`http://localhost:5000/get_filters/${supernova}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(filters => {
            if (selectedSupernovae[supernova]) {
              selectedSupernovae[supernova].push(...filters);
            } else {
              selectedSupernovae[supernova] = filters;
            }
          })
          .catch(error => {
            console.error('Fetch error:', error);
            if (!selectedSupernovae[supernova]) {
              selectedSupernovae[supernova] = [];
            }
          })
      );
      await Promise.all(filterRequests);
      setSelectedSupernovae({ ...selectedSupernovae });
    }
  };

  const handleFilterSelection = (band1, band2) => {
    setSelectedFilters(() => {
      return {filter1: band1, filter2: band2};
    });
  };

  const handleXAxisChange = (newXAxisType) => {
    setAxisConfig((prevConfig) => ({
      ...prevConfig,
      xAxisType: newXAxisType,
    }));
  };
  
  const handleYAxisChange = (newYAxisType) => {
    setAxisConfig((prevConfig) => ({
      ...prevConfig,
      yAxisType: newYAxisType,
    }));
  };

  return (
    <div className="App">
      <div className="top-controls">
        <div className="left-controls">
          <SupernovaSelection 
            selectedSupernovae={Object.keys(selectedSupernovae)}
            onOptionChange={handleSupernovaSelection}
            onTypeSelection={handleTypeSelection}
          />
        </div>
        <div className="right-controls">
          <AxisToggleComponent
            xAxisType={axisConfig.xAxisType}
            yAxisType={axisConfig.yAxisType}
            onXAxisChange={handleXAxisChange}
            onYAxisChange={handleYAxisChange}
          />
          <FilterBandSelection
            band1={selectedFilters["filter1"]}
            band2={selectedFilters["filter2"]}
            onChange={handleFilterSelection}
          />
        </div>
      </div>
      <FilterPlotComponent className="filter-plot"
        supernovae={selectedSupernovae}
        axis={axisConfig}
        highlighted={highlightedSupernovae}
      />
      <ColorPlotComponent className="color-plot"
        supernovae={selectedSupernovae}
        band1={selectedFilters["filter1"]}
        band2={selectedFilters["filter2"]}
        highlighted={highlightedSupernovae}
      />
      
  </div>
  );
}

export default App;
