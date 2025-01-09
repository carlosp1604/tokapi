// @deno-types="npm:@types/express@4"
import express from 'express'
import { container } from '~/awilix.container.ts'
import { GetUserByUsername } from './modules/User/Application/GetUserByUsername.ts'
import { param, validationResult } from 'express-validator'

const app = express()
const port = Number(Deno.env.get('PORT')) || 3000

app.get('/', (_req, res) => {
  res.status(200).send('Hello from Deno and Express!')
})

app.get('/users/:username', param('username').exists().isString().notEmpty(), async (req, res) => {
  const result = validationResult(req)

  if (!result.isEmpty()) {
    res.status(400).send({ errors: result.array() })
  }

  const useCase = container.resolve<GetUserByUsername>('getUserByUsername')

  const getUserResult = await useCase.get(req.params?.username)

  if (!getUserResult.success) {
    // In this use-case not makes sense, but we should check error type
    res.status(404).send('User not found')
  } else {
    res.status(200).json({
      message: 'User found',
      status: 'success',
      data: getUserResult.value,
    })
  }
})

app.listen(port, () => {
  console.log(`Listening on ${port} ...`)
})
