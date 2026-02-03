import "@/styles/globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { appWithTranslation } from "next-i18next";
import Script from "next/script";

function App({ Component, pageProps }) {
  return (
    <>
    {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            {/* Google Analytics */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
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
        src="https://ops.housejapanesecurry.com/tracking.js"
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
