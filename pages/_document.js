import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    const { locale } = this.props.__NEXT_DATA__;

    return (
      <Html lang={locale}>
        <Head>
          {/* SEO alternate links */}
          <link rel="alternate" hrefLang="en" href="/en" />
          <link rel="alternate" hrefLang="id" href="/id" />
          <link rel="alternate" hrefLang="zh" href="/zh" />
          <link rel="alternate" hrefLang="x-default" href="/" />

          <link rel="icon" href="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
