// @deno-types="npm:@types/express@4"
import express from 'express'
import usersRouter from '~/routes/UsersRouter.ts'
import { configureContainer } from '~/awilix.config.ts'
import { container } from '~/awilix.container.ts'

const app = express()
const port = Number(Deno.env.get('PORT')) || 3000

configureContainer(container)

/** Register routers **/
app.use('/users', usersRouter)

/** Server initialization **/
app.listen(port, () => {
  console.log(`Listening on ${port} ...`)
})
