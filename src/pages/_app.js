// src/pages/_app.js
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "./layout";

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default MyApp;
