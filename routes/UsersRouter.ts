// @deno-types="npm:@types/express@4"
import express from 'express'
import { check, param } from 'express-validator'
import { GetUserByUsernameController } from '~/modules/User/Application/GetUserByUsername/GetUserByUsernameController.ts'
import { CreateUserController } from '~/modules/User/Application/CreateUser/CreateUserController.ts'
import bodyParser from 'body-parser'

const usersRouter = express.Router()
const jsonParser = bodyParser.json()

// TODO: Find a good place to put request validators/sanitizers
const createUserValidate = [
  check('name').notEmpty().trim(),
  check('username').notEmpty().trim(),
  check('email').notEmpty().trim(),
  check('password').notEmpty(),
  check('token').notEmpty(),
]

usersRouter.get(
  '/:username',
  param('username').exists().isString().notEmpty(),
  async (req: express.Request, res: express.Response) => { await (new GetUserByUsernameController().get(req, res)) })

usersRouter.post(
  '/',
  jsonParser,
  createUserValidate,
  async (req: express.Request, res: express.Response) => { await (new CreateUserController().create(req, res)) })

export default usersRouter
