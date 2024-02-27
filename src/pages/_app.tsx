// src/pages/_app.tsx
import { SupernovaProvider } from '../context/SupernovaContext';
import '../styles/globals.css'
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupernovaProvider>
      <Component {...pageProps} />
    </SupernovaProvider>
  )
}

export default MyApp;
