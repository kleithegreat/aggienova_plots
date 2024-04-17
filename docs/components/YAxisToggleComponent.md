# YAxisToggleComponent.tsx

The `YAxisToggleComponent` allows toggling the y-axis type between "apparent" (apparent magnitude) and "absolute" (absolute magnitude).

## Dependencies
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing and modifying the plot settings.
- `useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
- `Switch`: A component from the `@mui/material` library for rendering a toggle switch.

## Props
`onNoData`: A function to be called when there is no distance modulus available for a selected supernova.

## State
`checked`: Represents the current state of the toggle switch.

## Effects
`useEffect`: Updates the `checked` state when the `yAxisType` changes in the `PlotSettingsContext`.

## Event Handlers
`handleChange`: Toggles the `yAxisType` between "apparent" and "absolute" in the `PlotSettingsContext` when the switch is toggled. When toggling from "apparent" to "absolute", it filters out supernovae without a distance modulus and calls the `onNoData` function with the removed supernovae names.

## Rendering
The component renders a toggle switch using the `Switch` component from `@mui/material`. The switch toggles between "apparent" and "absolute" y-axis types. The labels for the switch are displayed on either side of the switch, with the active label in black and the inactive label in gray.