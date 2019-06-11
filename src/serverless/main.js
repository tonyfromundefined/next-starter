const awsServerlessExpress = require('aws-serverless-express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const nocache = require('nocache')

const api = require('../api')

const index = require('../../dist/serverless/pages/index')
const error = require('../../dist/serverless/pages/_error')

const BINARY_MIME_TYPES = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]

const app = express()

app.use(nocache())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(api)

app.get('/', index.render)
app.get('/_error', error.render)

const server = awsServerlessExpress.createServer(app, null, BINARY_MIME_TYPES)

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context)
}
