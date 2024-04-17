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
The schema for the supabase database is as follows:
```sql
CREATE TABLE sn_types (
    type_id SERIAL PRIMARY KEY,
    type_name TEXT UNIQUE NOT NULL
);

CREATE TABLE filters (
    filter_id SERIAL PRIMARY KEY,
    filter_name TEXT UNIQUE NOT NULL
);

CREATE TABLE supernovae (
    sn_id SERIAL PRIMARY KEY,
    sn_name TEXT UNIQUE NOT NULL,
    redshift NUMERIC,
    distance_modulus NUMERIC,
    type_id INT REFERENCES sn_types(type_id) ON DELETE SET NULL
);

CREATE TABLE light_curves (
    curve_id SERIAL PRIMARY KEY,
    sn_id INT NOT NULL REFERENCES supernovae(sn_id) ON DELETE CASCADE,
    filter_id INT NOT NULL REFERENCES filters(filter_id) ON DELETE RESTRICT,
    mjd NUMERIC NOT NULL,
    magnitude NUMERIC,
    magnitude_error NUMERIC,
    hash TEXT UNIQUE NOT NULL
);
```
Raw photometry data can be found [here](https://github.com/pbrown801/SOUSA/tree/master/data).