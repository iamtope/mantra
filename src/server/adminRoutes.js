import express from 'express'
import { index as userIndex } from './AdminControllers/UserController'
const router = express.Router()
router.get('/users', userIndex)

export default router
