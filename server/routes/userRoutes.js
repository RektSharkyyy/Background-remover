import express from 'express'
import { buyCredit, clerkWebhooks, userCredits } from '../controllers/UserController.js'
import authUser from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/webhooks', clerkWebhooks)
userRouter.get('/credits', authUser, userCredits)
userRouter.post('/buy-credit', authUser, buyCredit)

export default userRouter;