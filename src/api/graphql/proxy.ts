import axios from 'axios'
import { Request, Response } from 'express-serve-static-core'
import { IncomingHttpHeaders } from 'http'

export default async (req: Request, res: Response) => {
  const endpoint = process.env.GRAPHQL_ENDPOINT as string
  const headers: IncomingHttpHeaders = {}

  if (req.headers.accept) {
    headers.accept = req.headers.accept
  }
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization
  }

  if (req.method === 'GET') {
    try {
      const { data } = await axios.get(endpoint, {
        headers,
      })

      return res
        .status(200)
        .send(data)

    } catch (error) {
      return res
        .status(error.response.status)
        .send(error.response.data)
    }
  }

  if (req.method === 'POST') {
    try {
      const { data } = await axios.post(endpoint, req.body, {
        headers,
      })

      return res
        .status(200)
        .send(data)

    } catch (error) {
      return res
        .status(error.response.status)
        .send(error.response.data)
    }
  }

  return res
    .status(500)
    .send('Invalid HTTP Method')
}
