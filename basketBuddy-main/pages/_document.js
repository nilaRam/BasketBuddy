import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon/favicon.ico">
          </link>
          <link rel ="manifest" href="/manifest.json" />
          </Head>
        <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
