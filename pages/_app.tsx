import { SelectedSNeProvider } from '../contexts/SelectedSNeContext';
import { PlotSettingsProvider } from '../contexts/PlotSettingsContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SelectedSNeProvider>
      <PlotSettingsProvider>
        <Component {...pageProps} />
      </PlotSettingsProvider>
    </SelectedSNeProvider>
  );
}

export default MyApp;