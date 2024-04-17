# SNeNameSearch.tsx
The `SNeNameSearch` component provides a search functionality for selecting supernovae by name.
## Dependencies
- `useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing the plot settings.
- `Autocomplete`, TextField: Components from the `@mui/material` library for rendering the search input.
- `useDebounce`: A custom hook from the `use-debounce` library for debouncing the search term.
- `supabase`: The Supabase client for fetching data from the database.
## Props
`onNoData`: A function to be called when there is no photometry data available for a selected supernova.
## State
- `searchTerm`: The current search term entered by the user.
- `debouncedSearchTerm`: The debounced version of the search term.
- `availableSNe`: An array of `Supernova` objects representing the available supernovae.
## Effects
`useEffect`: Fetches the available supernovae from the Supabase database when the component mounts.
## Event Handlers
`handleAdd`: Checks if the selected supernova has photometry data available and adds it to the `selectedSNe` state if it meets the criteria.
## Rendering
The component renders an `Autocomplete` component with a `TextField` as its input. It filters the `availableSNe` based on the `debouncedSearchTerm` and displays the filtered options. When an option is selected, it calls the `handleAdd` function.