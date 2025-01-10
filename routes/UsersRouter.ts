// @deno-types="npm:@types/express@4"
import express from 'express'
import { param } from 'express-validator'
import { GetUserByUsernameController } from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameController.ts'

const usersRouter = express.Router()

usersRouter.get(
  '/:username',
  param('username').exists().isString().notEmpty(),
  async (req: express.Request, res: express.Response) => { await (new GetUserByUsernameController().get(req, res)) })

export default usersRouter
