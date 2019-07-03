import { Router } from 'express'

const router = Router()

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
