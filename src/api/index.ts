import { Router } from 'express'

const router = Router()

/**
 * @todo
 * APIs can be implemented using express.js
 */

router.get('/index.json', (_req, res) => {
  return res.json({
    hello: 'world',
  })
})

export default router
