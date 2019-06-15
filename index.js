const bodyParser = require('body-parser')
const chokidar = require('chokidar')
const cookieParser = require('cookie-parser')
const express = require('express')
const fs = require('fs-extra')
const next = require('next')
const path = require('path')

const api = require('./src/api')
const config = require('./next.config')
const options = require('./options')

const IS_PROD = process.env.NODE_ENV === 'production'
const PORT = IS_PROD ? 80 : 3000

require('dotenv').config({
  path: `./.env.${IS_PROD ? 'production' : 'development'}`,
});

(async function main() {
  const server = await createServer()

  server.listen(PORT)
})()

async function createServer() {
  const app = next({
    config,
    dev: !IS_PROD,
    dir: path.resolve(__dirname, './src'),
  })
  
  await app.prepare()

  const server = express()

  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(cookieParser())

  server.use(api)
  server.use((req, res) => app.render(req, res, req._parsedUrl.pathname, req.query))

  return server
}

if (options.generatePageAliases && !IS_PROD) {
  chokidar
    .watch(path.resolve('./src/services'), {
      ignored: /^\./,
      persistent: true,
    })
    .on('add', onPageAdded)
    .on('unlink', onPageRemoved)
}

function onPageAdded (p) {
  const parsed = p.slice(p.indexOf('/src/services') + 14).split('/')

  const service = parsed[0]
  const type = parsed[1]

  if (type !== 'pages') {
    return
  }

  const remains = path.join(...parsed.filter((_, index) => index > 1))

  const generatedFile = {
    path: path.resolve(service === 'index' ? `./src/pages/${remains}`: `./src/pages/${service}/${remains}`),
    content: `export { default } from '~~/${service}/pages/${remains}'\n`
  }

  fs.outputFile(generatedFile.path, generatedFile.content)
}

function onPageRemoved (p) {
  const parsed = p.slice(p.indexOf('/src/services') + 14).split('/')

  const service = parsed[0]
  const type = parsed[1]

  if (type !== 'pages') {
    return
  }

  const remains = path.join(...parsed.filter((_, index) => index > 1))
  const generatedFilePath = path.resolve(service === 'index' ? `./src/pages/${remains}`: `./src/pages/${service}/${remains}`)

  fs.remove(generatedFilePath)
}
