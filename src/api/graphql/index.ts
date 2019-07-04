import { Router } from 'express'
import authorization from './authorization'
import proxy from './proxy'

const router = Router()

router.use(authorization)
router.use(proxy)

export default router
