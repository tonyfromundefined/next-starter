import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import asyncify from 'express-asyncify'
import session from 'express-session'
import next from 'next'
import path from 'path'
import conf from './next.config'
import api from './src/api'

const dev = process.env.NODE_ENV !== 'production'
const port = dev ? 3000 : 80

main()

async function main() {
  const app = next({
    conf,
    dev,
    dir: path.resolve(__dirname, './src'),
  })

  await app.prepare()

  const server = asyncify(express())

  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(cookieParser())

  server.use(session({
    secret: '602f0a56-136b-524b-9871-d0450ef60b48',
    resave: true,
    saveUninitialized: true,
  }))

  server.use(api)
  server.use((req: any, res) => {
    return app.render(req, res, req._parsedUrl.pathname, req.query)
  })

  server.listen(port)
}
