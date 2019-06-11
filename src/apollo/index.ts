import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { Store } from '../store'

let apolloClient: ApolloClient<NormalizedCacheObject>

const isServer = typeof window === 'undefined'

export function createApolloClient(store: Store, state?: any) {
  if (apolloClient) {
    return apolloClient

  } else {
    const httpLink = createHttpLink({
      fetch,
      uri: store.environments.NEXT_APP_GRAPHQL_ENDPOINT,
    })

    const link = createAuthorizationLink(store).concat(httpLink)

    const cache = new InMemoryCache()

    cache.restore(state || {})

    if (isServer) {
      return new ApolloClient({
        cache,
        link,
        ssrMode: true,
      })

    } else {
      return apolloClient = new ApolloClient({
        cache,
        connectToDevTools: true,
        link,
      })
    }
  }
}

function createAuthorizationLink(store: Store) {
  return setContext(async (_req, { headers }) => {
    if (!store.tokens) {
      return {
        headers,
      }
    }

    const { accessToken } = store.tokens

    /**
     * @todo
     * If `store.tokens.accessToken` is expired,
     * refresh it with `store.tokens.refreshToken`
     * This function can be executed both on client and server
     */

    return createHeaders(accessToken, headers)
  })
}

function createHeaders(accessToken: string, oldHeaders: any) {
  return {
    headers: { Authorization: `Bearer ${accessToken}`, ...oldHeaders },
  }
}
