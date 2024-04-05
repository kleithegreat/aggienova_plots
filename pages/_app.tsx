import { SelectedSNeProvider } from '../contexts/SelectedSNeContext';
import { PlotSettingsProvider } from '../contexts/PlotSettingsContext';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SelectedSNeProvider>
      <PlotSettingsProvider>
        <div className="font-sans">
          <Component {...pageProps} />
        </div>
      </PlotSettingsProvider>
    </SelectedSNeProvider>
  );
}

export default MyApp;
