import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import { checkTokenIsExpired } from '../helpers'
import { IStore } from '../store'

let apolloClient: ApolloClient<NormalizedCacheObject>

const isServer = typeof window === 'undefined'

export function createApolloClient(store: IStore, state?: any) {
  if (apolloClient) {
    return apolloClient

  } else {
    const httpLink = createHttpLink({
      fetch,
      uri: store.environments.get('NEXT_APP_GRAPHQL_ENDPOINT'),
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

function createAuthorizationLink(store: IStore) {
  return setContext(async (_req, { headers }) => {
    const tokens = store.tokens

    if (typeof tokens === 'undefined') {
      return {
        headers,
      }
    }

    const isStoredAccessTokenExpired = checkTokenIsExpired(tokens.accessToken)

    if (!isStoredAccessTokenExpired) {
      return createHeaders(tokens.accessToken, headers)

    } else {
      try {
        const { accessToken: refreshedAccessToken } = await store.refreshTokens(tokens)

        if (!refreshedAccessToken) {
          throw new Error()
        }

        return createHeaders(refreshedAccessToken, headers)

      } catch (error) {
        return {
          headers,
        }
      }
    }
  })
}

function createHeaders(accessToken: string, oldHeaders: any) {
  return {
    headers: { Authorization: `Bearer ${accessToken}`, ...oldHeaders },
  }
}
