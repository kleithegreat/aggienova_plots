# ResetButton.tsx

The `ResetButton` component provides a button to reset the plot options and selected supernovae.

## Dependencies
- `useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing and modifying the plot settings.

## Event Handlers
`handleReset`: Resets the selected supernovae, x-axis type, y-axis type, plot type, and color bands to their default values.

## Rendering
The component renders a button with the label "Reset". When clicked, it triggers the `handleReset` function to reset the plot options and selected supernovae.