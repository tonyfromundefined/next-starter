declare module 'express-asyncify' {
  import { Express } from 'express-serve-static-core'
  export default function(express: Express): Express
}
