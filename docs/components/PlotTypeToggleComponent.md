# PlotTypeToggleComponent.tsx
The `PlotTypeToggleComponent` allows toggling between magnitude and color plot types.

## Dependencies
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing and modifying the plot settings.
- `Switch`: A component from the `@mui/material` library for rendering a toggle switch.

## State
`checked`: Represents the current state of the toggle switch.

## Effects
`useEffect`: Updates the `checked` state when the `plotType` changes in the `PlotSettingsContext`.

## Event Handlers
`handleChange`: Toggles the `plotType` between "magnitude" and "color" in the `PlotSettingsContext` when the switch is toggled.

## Rendering
The component renders a toggle switch using the `Switch` component from `@mui/material`. The switch toggles between "magnitude" and "color" plot types. The labels for the switch are displayed on either side of the switch, with the active label in black and the inactive label in gray.