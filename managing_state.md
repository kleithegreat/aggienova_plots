# Components and Their State
SearchBar/Dropdown Component:
- Local State: Search input value, dropdown open state.
- Global State Interactions: Updates search results on user input, adds selected supernovae or types to the global list of selected supernovae.

SupernovaList Component:
- Global State: Manages the list of currently selected supernovae, including adding or removing supernovae and toggling filters.
- Local State: None, but it might manage UI states like collapse/expand details for each supernova.

PlotArea Component:
- Global State: Uses selected supernovae, active filters, and plot options to render the plots.
- Local State: Could manage UI-related states, such as loading states or error messages.

PlotOptions Component:
- Global State: Updates global state with the user's plot configuration choices.
- Local State: None or minimal, primarily UI-related states like dropdown open states.

FilterToggle Component (within SupernovaList):
- Global State: Updates which filters are active for each selected supernova.
- Local State: None, directly manipulates the global state.

BandSelector Component (for Color Plot):
- Global State: Updates the selected bands for magnitude difference calculation in the global state.
- Local State: Could have local UI state for dropdowns.
