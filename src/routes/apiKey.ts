import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  return c.json({ message: 'API KEY ROUTE' })
})

export default app
