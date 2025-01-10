import { describe, expect, it, beforeAll } from '@jest/globals'
import express from 'express'
import usersRouter from '~/routes/UsersRouter.ts'
import request from 'supertest'

describe('GetUserByUsername', () => {
  const app = express()

  app.use('/users', usersRouter)

  beforeAll(() => {
    app.listen(3000, () => {
      console.log(`Listening on ${3000} ...`)
    })
  })

  it('should return 200 OK', async () => {
    return request(app, { })
      .get('/users/pedro_bombero')
      .expect(200)
      .then((response: Response) => {
        expect(response.status).toBe(200)
      })
  })
})
