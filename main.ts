// @deno-types="npm:@types/express@4"
import express from 'express'
import usersRouter from '~/routes/UsersRouter.ts'

const app = express()
const port = Number(Deno.env.get('PORT')) || 3000

/** Register routers **/
app.use('/users', usersRouter)

/** Server initialization **/
app.listen(port, () => {
  console.log(`Listening on ${port} ...`)
})
