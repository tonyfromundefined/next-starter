import ApolloClient from 'apollo-client'
import pickBy from 'lodash/pickBy'
import { Container, default as NextApp } from 'next/app'
import Head from 'next/head'
import React, { Fragment } from 'react'
import { ApolloProvider as ApolloHookProvider, getMarkupFromTree } from 'react-apollo-hooks'
import { renderToString as renderFunction } from 'react-dom/server'
import { createApolloClient } from '../apollo'
import { createStore, IEnvironments, Store, StoreProvider } from '../store'
import { ThemeProvider } from '../styled'
import GlobalStyle from '../styled/global'
import baseTheme from '../styled/themes/base'

const isServer = typeof window === 'undefined'

const environments = isServer ? extractNextEnvironments(process.env) : undefined

export default class extends React.Component {
  static async getInitialProps(appContext: any) {
    const appProps = await App.getInitialProps(appContext)

    const { Component, router } = appContext

    const store = createStore({
      environments,
    })

    const apollo = createApolloClient(store)

    appContext.ctx.store = store

    if (isServer) {
      try {
        await Promise.all([
          store.nextServerInit(appContext.ctx.req, appContext.ctx.res),
          getMarkupFromTree({
            tree: (
              <App
                Component={Component}
                router={router}
                apolloClient={apollo}
                store={store}
                {...appProps}
              />
            ),
            renderFunction,
          }),
        ])

      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error('[Error 29948] Pre-operation required for SSR failed')
      }

      Head.rewind()
    }

    return {
      apolloState: apollo.cache.extract(),
      store,
      ...appProps,
    }
  }

  apolloClient: ApolloClient<any>
  store: Store

  constructor(props: any) {
    super(props)
    this.store = createStore(props.store)
    this.apolloClient = createApolloClient(this.store, props.apolloState)
  }

  render() {
    return (
      <App
        apolloClient={this.apolloClient}
        store={this.store}
        {...this.props}
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
