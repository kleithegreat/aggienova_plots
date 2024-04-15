# Contributing
This project uses the following technologies. Familiarity with these technologies is recommended before contributing:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Plotly.js](https://plotly.com/javascript/)
- [Vercel](https://vercel.com/)

## Project Structure
- `components/`: React components.
- `contexts/`: React contexts.
- `lib/`: Contains the `supabase` client and schema types.
- `pages/`: Next.js pages. Currently only has an index page and an override for `_app.tsx`.

## Components
Read more about the components in their respective READMEs.

## Contexts
Most of the state management is done with the React context API.
### `SelectedSNeContext.tsx`
This context manages the state of the supernoave selected for plotting.
It is used by the following components:
- `PlotComponent.tsx`
- `SNeNameSearch.tsx`
- `SNePlotList.tsx`
- `TypeSearch.tsx`
- `ResetButton.tsx`

The context contains one state of an array of `Supernova` objects, as defined in the `lib/index.ts` file.

### `PlotSettingsContext.tsx`
This context manages the state of the plot settings.
It is used by the following components:
- `PlotComponent.tsx`
- `ColorBandSelector.tsx`
- `PlotTypeToggleComponent.tsx`
- `ResetButton.tsx`
- `SNeNameSearch.tsx`
- `TypeSearch.tsx`
- `XAxisToggleComponent.tsx`
- `YAxisToggleComponent.tsx`

See the `lib/index.ts` file for the types used in this context.

## Supabase