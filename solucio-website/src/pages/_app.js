// src/pages/_app.js
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [clerkPublishableKey, setClerkPublishableKey] = useState(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (key) {
      setClerkPublishableKey(key);
    } else {
      console.error('Missing publishable key for Clerk. Check your .env.local file.');
    }
  }, []);

  if (!clerkPublishableKey) {
    return <div>Loading...</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
