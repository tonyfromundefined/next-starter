import { Request, Response } from 'express-serve-static-core'
import forIn from 'lodash/forIn'
import { useStaticRendering } from 'mobx-react-lite'
import { types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'
import { checkTokenIsExpired } from '../helpers'

const isServer = typeof window === 'undefined'

useStaticRendering(isServer)

export interface IEnvironments {
  [key: string]: string
}
export interface ITokens {
  accessToken: string
  refreshToken: string
}

export type IStore = typeof Store.Type
type IStoreState = typeof Store.CreationType

let store: IStore | null = null

export function createStore(storeState: IStoreState): IStore {
  if (isServer) {
    return Store.create(storeState)

  } else if (store !== null) {
    return store

  } else {
    return store = Store.create(storeState)
  }
}

const Tokens = types.model('Tokens', {
  accessToken: types.string,
  refreshToken: types.string,
})

const User = types.model('User', {
  id: types.string,
})

const Store = types
  .model('Store', {
    environments: types.map(types.string),
    tokens: types.maybe(Tokens),
    user: types.maybe(User),
  })
  .actions((self) => ({
    setEnvironments(environments: { [key: string]: string }) {
      Object.entries(environments).map(([key, value]) => {
        if (value) {
          self.environments.set(key, value)
        }
      })
    },
    setTokens(tokens: typeof Tokens.Type, res?: Response) {
      self.tokens = tokens

      if (isServer && res) {
        setMapInCookie(res, tokens)
      }
    },
    removeTokens(res: Response) {
      delete self.tokens

      if (isServer && res) {
        removeMapInCookie(['accessToken', 'refreshToken'], res)
      }
    },
    async refreshTokens(_tokens: typeof Tokens.Type): Promise<ITokens> {
      return {
        accessToken: '',
        refreshToken: '',
      }
    },
    setUser(user: typeof User.Type) {
      self.user = user
    },
    async nextServerInit(req: Request, res: Response) {
      try {
        if (!req || !res) {
          throw new Error()
        }

        if (!req.cookies.accessToken || !req.cookies.refreshToken) {
          throw new Error()
        }

        const tokens: ITokens = {
          accessToken: req.cookies.accessToken,
          refreshToken: req.cookies.refreshToken,
        }

        const isRefreshTokenExpired = checkTokenIsExpired(tokens.refreshToken)
        const isAccessTokenExpired = checkTokenIsExpired(tokens.accessToken)

        if (isRefreshTokenExpired) {
          throw new Error()
        }

        if (isAccessTokenExpired) {
          const refreshedTokens = await this.refreshTokens(tokens)

          tokens.accessToken = refreshedTokens.accessToken
          tokens.refreshToken = refreshedTokens.refreshToken
        }

        this.setTokens(tokens)

        /**
         * @todo
         * Hydrate store information using api with fresh `accessToken`
         */
      } catch (error) {
        this.removeTokens(res)
      }
    },
  }))

function setMapInCookie(res: Response, map: { [key: string]: string }): void {
  let cookies = ''

  forIn(map, (value, key) => {
    cookies += `${key}=${value}; `
  })

  res.setHeader('Set-Cookie', cookies + 'Path=/; Secure; HttpOnly;')
}

function removeMapInCookie(keys: string[], res: Response): void {
  let cookies = ''

  keys.map((key) => {
    cookies += `${key}=deleted; `
  })

  res.setHeader('Set-Cookie', cookies + 'Path=/; Secure; HttpOnly;')
}

export const StoreContext = createContext({} as IStore)
export const StoreProvider = StoreContext.Provider
export const useStore = () => useContext(StoreContext)
