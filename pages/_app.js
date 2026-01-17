import "@/styles/globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { appWithTranslation } from "next-i18next";
import Script from "next/script";

function App({ Component, pageProps }) {
  return (
    <>
      {/* Tracking API key (safe place) */}
      <Script
        id="tracking-api-key"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.trackingApiKey = process.env.API_KEY;
          `,
        }}
      />

      {/* External tracking script */}
      {/* <Script
        src="https://prahwa.net/tracking.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Tracking script loaded successfully.");
        }}
        onError={(e) => {
          console.error("Error loading tracking script:", e);
        }}
      /> */}

      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default appWithTranslation(App);
