# TypeSearch.tsx

The `TypeSearch` component allows searching and selecting supernovae by type.

## Dependencies
- `useSelectedSNe`: A custom hook from the `SelectedSNeContext` for accessing and modifying the selected supernovae.
- `usePlotSettings`: A custom hook from the `PlotSettingsContext` for accessing the plot settings.
- `Autocomplete`, `TextField`: Components from the `@mui/material` library for rendering the search input and suggestions.
- `useDebounce`: A custom hook from the `use-debounce` library for debouncing the search term.
- `supabase`: The Supabase client for fetching data from the database.

## Props
`onNoData`: A function to be called when there is no photometry data available for a selected supernova.

## State
- `searchTerm`: The current search term entered by the user.
- `debouncedSearchTerm`: The debounced version of the search term.
- `availableTypes`: An array of `SnType` objects representing the available supernova types.

## Effects
`useEffect`: Fetches the available supernova types from the Supabase database when the component mounts.

## Event Handlers
`handleSearch`: Fetches the supernovae of the selected type from the Supabase database, filters out supernovae without photometry data or distance modulus (if required), and adds the valid supernovae to the `selectedSNe` state.

### Rendering
The component renders an `Autocomplete` component with a `TextField` as its input. It filters the `availableTypes` based on the `debouncedSearchTerm` and displays the filtered options. When an option is selected, it calls the `handleSearch` function to fetch and add the corresponding supernovae to the selection.