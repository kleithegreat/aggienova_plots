# OptionsComponent.tsx

The `OptionsComponent` serves as a container for various options and controls related to the plot.

## Dependencies
- `Paper`: A component from the `@mui/material` library for rendering a paper-like container.
- `SNeNameSearch`, `TypeSearch`, `SNePlotList`, `XAxisToggleComponent`, `YAxisToggleComponent`, `PlotTypeToggleComponent`, `ColorBandSelector`, `ResetButton`: Custom components for different options and controls.

## Props
`onNoData`: A function to be called when there is no data available for a selected supernova or type.

## Rendering
The component renders a `Paper` container with a vertical stack of various options and controls. It includes the following components:
- `SNeNameSearch`: For searching and selecting supernovae by name.
- `TypeSearch`: For searching and selecting supernovae by type.
- `XAxisToggleComponent`: For toggling the x-axis type.
- `YAxisToggleComponent`: For toggling the y-axis type.
- `PlotTypeToggleComponent`: For toggling the plot type between magnitude and color.
- `ColorBandSelector`: For selecting the color bands for color difference plotting.
- `SNePlotList`: For displaying the list of selected supernovae.
- `ResetButton`: For resetting the plot options and selected supernovae.