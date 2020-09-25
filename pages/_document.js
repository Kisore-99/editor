import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body style={{ background: "#000" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
