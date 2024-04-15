# Aggienova Plots

This is a Next.js web app for plotting photometry data from the Aggienova project.
Visit the live site [here](https://aggienova-plots.vercel.app/), or run it locally with the instructions below.

## Running Locally
Prerequisites:
- Node.js
- npm

1. Clone the repository
2. Install dependencies
```bash
npm install
```
3. Run the development server
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features
This is a simple web app that allows users to customize photometry plots.
Users can:
- Search for supernovae by name
- Plot all supernovae of a given type
- Customize the plot appearance
    - Toggle the x-axis between modified Julian date and days since first observation
    - Toggle the y-axis between apparent magnitude and absolute magnitude
    - Select certain filters to be plotted
- Plot the color difference between two filters (e.g. B-V)

## Contributing
To learn more about contributing to this project, see the documentation under the `docs/` directory.