import { Context } from 'aws-lambda'
import awsServerlessExpress from 'aws-serverless-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import asyncify from 'express-asyncify'
import nocache from 'nocache'

import api from '../src/api'

import * as error from '../dist/serverless/pages/_error'
import * as index from '../dist/serverless/pages/index'

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
  'text/xml',
]

const app = asyncify(express())

app.use(nocache())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(api)

app.get('/', (index as any).render)
app.get('/_error', (error as any).render)

const server = awsServerlessExpress.createServer(app, undefined, BINARY_MIME_TYPES)

export const handler = (event: any, context: Context) => {
  return awsServerlessExpress.proxy(server, event, context)
}
