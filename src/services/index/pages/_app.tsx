import ApolloClient from 'apollo-client'
import pickBy from 'lodash/pickBy'
import { Container, default as NextApp } from 'next/app'
import Head from 'next/head'
import React, { Fragment } from 'react'
import { ApolloProvider as ApolloHookProvider, getMarkupFromTree } from 'react-apollo-hooks'
import { renderToString as renderFunction } from 'react-dom/server'
import { ThemeProvider } from '~/styled'
import GlobalStyle from '~/styled/global'
import baseTheme from '~/styled/themes/base'
import { createApolloClient } from '../apollo'
import FaviconImage from '../assets/favicon.png?url'
import { createStore, IEnvironments, IStore, StoreProvider } from '../store'

export default class extends React.Component {
  static async getInitialProps(appContext: any) {
    const appProps = await App.getInitialProps(appContext)

    const { Component, router } = appContext

    const store = createStore({
      environments: extractNextEnvironments(process.env as IEnvironments),
    })

    try {
      await store.nextServerInit(appContext.ctx.req, appContext.ctx.res)
      appContext.ctx.store = store

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('[Error 18598] Store initialization failed')
    }

    const apolloClient = createApolloClient(store)

    try {
      await getMarkupFromTree({
        tree: (
          <App
            Component={Component}
            router={router}
            apolloClient={apolloClient}
            store={store}
            {...appProps}
          />
        ),
        renderFunction,
      })

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('[Error 29948] Operating queries for SSR failed')
    }

    Head.rewind()

    return {
      apolloState: apolloClient.cache.extract(),
      storeState: store,
      ...appProps,
    }
  }

  apolloClient: ApolloClient<any>
  store: IStore

  constructor(props: any) {
    super(props)
    this.store = createStore(props.storeState)
    this.apolloClient = createApolloClient(this.store, props.apolloState)
  }

  render() {
    return (
      <App
        {...this.props}
        apolloClient={this.apolloClient}
        store={this.store}
      />
    )
  }
}

class App extends NextApp<any> {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>Hello, Next.js</title>
          <link rel='shortcut icon' href={FaviconImage} />
        </Head>
        <ApolloHookProvider client={this.props.apolloClient}>
          <StoreProvider value={this.props.store}>
            <ThemeProvider theme={baseTheme}>
              <Fragment>
                <Component {...pageProps} />
                <GlobalStyle />
              </Fragment>
            </ThemeProvider>
          </StoreProvider>
        </ApolloHookProvider>
      </Container>
    )
  }
}

function extractNextEnvironments(environments: IEnvironments): IEnvironments {
  return pickBy(environments, (_value, key) => key.indexOf('NEXT_APP') !== -1)
}
