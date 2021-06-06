/**
 * No Next, a gente usa do _document, e fica em volta de toda a aplicação,
 * mas só é chamado uma vez, independente de quantas vezes forem chamadas
 * 
 */

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}