import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class extends Document {
  static async getInitialProps(context: any) {
    const sheet = new ServerStyleSheet()
    const { renderPage: h } = context

    context.renderPage = () => h({
      enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
    })

    const initialProps = await Document.getInitialProps(context)

    return {
      ...initialProps,
      styles: sheet.getStyleElement(),
    }
  }

  render() {
    return (
      <html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
