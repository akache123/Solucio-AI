// src/pages/_app.js
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/clerk-react';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
