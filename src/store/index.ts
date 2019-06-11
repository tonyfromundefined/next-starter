import { Request, Response } from 'express-serve-static-core'
import forIn from 'lodash/forIn'
import { action, computed, observable } from 'mobx'
import { useStaticRendering } from 'mobx-react-lite'
import { createContext, useContext } from 'react'

const isServer = typeof window === 'undefined'

let store: Store

useStaticRendering(isServer)

export interface IEnvironments {
  [key: string]: string | undefined
}
export interface ITokens {
  accessToken: string
  refreshToken: string
}

export interface IStore {
  environments: IEnvironments
  tokens: ITokens | null
}

export function createStore(storeState?: Partial<IStore>) {
  switch (true) {
    case isServer:
      return new Store(storeState)

    case typeof store !== 'undefined':
      return store

    default:
      return store = new Store(storeState)
  }
}

export class Store implements IStore {
  @observable
  environments: IEnvironments

  @observable
  tokens: ITokens | null

  constructor(storeState: Partial<IStore> = {}) {
    this.environments = storeState.environments || {}
    this.tokens = storeState.tokens || null
  }

  @computed
  get isAuthenticated() {
    return this.tokens !== null
  }

  @action
  setTokens(tokens: ITokens, res?: Response) {
    this.tokens = tokens

    if (isServer && res) {
      setTokensInCookie(res, tokens)
    }
  }

  /**
   * Refresh `this.tokens.accessToken` with `this.tokens.refreshToken`
   */
  @action
  async refreshTokens() {}

  /**
   * Store Hydration
   * @param req Request
   * @param res Response
   */
  @action
  async nextServerInit(req: Request, res: Response) {
    if (!req || !res) {
      return
    }

    if (!req.cookies.accessToken || !req.cookies.refreshToken) {
      return
    }

    /**
     * @todo
     * If `accessToken` is expired, refresh the `accessToken`.
     * and if `refreshToken` is expired, remove all tokens.
     */

    this.setTokens({
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    })

    /**
     * @todo
     * Hydrate store information using api with fresh `accessToken`
     */
  }
}

function setTokensInCookie(res: Response, tokens: ITokens): void {
  let cookies = ''
  forIn(tokens, (value, key) => {
    cookies += `${key}=${value}; `
  })

  res.setHeader('Set-Cookie', cookies + 'Path=/; Secure; HttpOnly;')
}

export const StoreContext = createContext({} as Store)
export const StoreProvider = StoreContext.Provider
export const useStore = () => useContext(StoreContext)
