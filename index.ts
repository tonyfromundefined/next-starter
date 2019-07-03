import bodyParser from 'body-parser'
import chokidar from 'chokidar'
import cookieParser from 'cookie-parser'
import express from 'express'
import asyncify from 'express-asyncify'
import fs from 'fs-extra'
import next from 'next'
import path from 'path'
import conf from './next.config'
import options from './options.json'
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

  server.use(api)
  server.use((req: any, res) => {
    return app.render(req, res, req._parsedUrl.pathname, req.query)
  })

  server.listen(port)
}

/**
 * Additional Helpers
 */
switch (true) {
  case options.generatePageAliases: {
    if (!dev) {
      break
    }

    const onFileAdded = (__path: string) => {
      const parsed = __path.slice(__path.indexOf('/src/services') + 14).split('/')

      const service = parsed[0]
      const type = parsed[1]
      const file = path.join(...parsed.filter((_, index) => index > 1))

      if (type !== 'pages') {
        return
      }

      const generatedFilePath = path.resolve(service === 'index' ? `./src/pages/${file}` : `./src/pages/${service}/${file}`)
      const generatedFileContent = `export { default } from '~~/${service}/pages/${file}'\n`

      fs.outputFile(generatedFilePath, generatedFileContent)
    }

    const onFileRemoved = (__path: string) => {
      const parsed = __path.slice(__path.indexOf('/src/services') + 14).split('/')

      const service = parsed[0]
      const type = parsed[1]
      const file = path.join(...parsed.filter((_, index) => index > 1))

      if (type !== 'pages') {
        return
      }

      const generatedFilePath = path.resolve(service === 'index' ? `./src/pages/${file}` : `./src/pages/${service}/${file}`)

      fs.remove(generatedFilePath)
    }

    chokidar
      .watch(path.resolve('./src/services'), {
        ignored: /^\./,
        persistent: true,
      })
      .on('add', onFileAdded)
      .on('unlink', onFileRemoved)

    break
  }
}
