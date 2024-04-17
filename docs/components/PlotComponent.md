# PlotComponent.tsx
The `PlotComponent` is responsible for rendering the plot using the `react-plotly.js` library. 
It fetches and processes the data based on the selected supernovae and plot settings.
## Dependencies
- `useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing the plot settings.
- `Paper`: A component from the `@mui/material` library for rendering a paper-like container.
- `Plot`: A dynamically imported component from `react-plotly.js` for rendering the plot.
- `supabase`: The Supabase client for fetching data from the database.
## State
`plotData`: An array of `PlotData` objects representing the data to be plotted.
## Effects
`useEffect`: Fetches the light curves data from the Supabase database based on the selected supernovae and plot settings. It processes the data and updates the `plotData` state.
## Rendering
The component renders a `Paper` container with a `Plot` component inside. The `Plot` component receives the `plotData` as its `data` prop and various layout and configuration options.

### How the plotting logic works in the giant useEffect
The `useEffect` hook in the `PlotComponent` is responsible for fetching and processing the light curve data based on the selected supernovae and plot settings. Here's a step-by-step breakdown of what happens inside the `useEffect`:

1. It first clears the existing `plotData` state by calling `setPlotData([])`.
2. It defines an asynchronous function `fetchData` that will be called immediately.
3. Inside `fetchData`, it fetches the filter types from the Supabase database using `supabase.from("filters").select("*")`. It then creates a dictionary `filterTypeDict` that maps filter IDs to filter names. This is just so we don't need to make a query every time we want to go from filter ID to filter name (slight design oversight on the database schema).
4. It fetches the light curves for the selected supernovae using `supabase.from("light_curves").select("*").in("sn_id", selectedSNe.map(({ sn_id }) => sn_id))`.
5. It creates a dictionary `lightCurvesDict` that organizes the light curves by supernova ID and filter ID, such that `lightCurvesDict[sn_id][filter_id]` contains an array of light curves for a specific supernova and filter.
6. If the `plotType` is "magnitude", it iterates over each selected supernova and each filter type. For each combination, it retrieves the corresponding light curves from `lightCurvesDict`.
7. It combines the data points from the light curves into a single array `combinedData`, which includes the x-value (mjd), y-value (magnitude), and error (magnitude_error) for each data point.
8. If the `xAxisType` is "dsfo" (days since first observation, goal is to use days since explosion in the future), it subtracts the minimum x-value from all x-values to normalize the data to days since first observation.
9. If the `yAxisType` is "absolute", it subtracts the distance modulus (if available) from the y-values to convert apparent magnitudes to absolute magnitudes.
10. It sorts the `combinedData` array based on the x-values.
11. It extracts the x-values, y-values, and error values from `combinedData` into separate arrays.
12. It updates the `plotData` state by adding a new object to the array, which includes the x-values, y-values, error values, plot mode, name (supernova name and filter), and other plot configuration options.
13. If the plotType is "color", it currently does nothing (placeholder for future implementation).
14. The `useEffect` hook is triggered whenever any of the dependencies (`selectedSNe`, `xAxisType`, `yAxisType`, `plotType`, `firstColor`, `secondColor`) change (automatic plot updates).
This `useEffect` hook ensures that the plot data is fetched and processed whenever the selected supernovae or plot settings change, allowing for dynamic updates to the plot based on user interactions.

There are probably quite a few anti-patterns in this code, but it works for now. 