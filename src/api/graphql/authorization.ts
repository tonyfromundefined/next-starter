import { NextFunction, Request, Response } from 'express-serve-static-core'

export default (_AUTH_SERVICE_ENDPOINT: string) => async (_req: Request, _res: Response, next: NextFunction) => {
  next()
}
