import { Router } from 'express'
import graphql from './graphql'

const router = Router()

router.use('/graphql', graphql)

/**
 * @todo
 * APIs can be implemented using express.js
 */

router.get('/index.json', (req, res) => {
  return res.json({
    sessionID: req.sessionID,
    hello: 'world',
  })
})

export default router
