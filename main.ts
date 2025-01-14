// @deno-types="npm:@types/express@4"
import express from 'express'

const app = express()
const port = Number(Deno.env.get('PORT')) || 3000

app.get('/', (_req, res) => {
  res.status(200).send('Hello from Deno and Express!')
})

app.listen(port, () => {
  console.log(`Listening on ${port} ...`)
})
