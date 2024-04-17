# SNePlotList.tsx
The `SNePlotList` component displays a list of the currently selected supernovae and allows removing them from the selection.
## Dependencies
`useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
## State
`hoveredSn`: The ID of the currently hovered supernova, or `null` if none is hovered.
## Event Handlers
`handleClick`: Removes the clicked supernova from the `selectedSNe` state.
## Rendering
The component renders a list of the selected supernovae names. When a supernova is hovered, its name is displayed with a strikethrough and gray color. Clicking on a supernova removes it from the selection.