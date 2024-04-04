import { SelectedSNeProvider } from '../lib/SelectedSNeContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SelectedSNeProvider>
      <Component {...pageProps} />
    </SelectedSNeProvider>
  );
}

export default MyApp;