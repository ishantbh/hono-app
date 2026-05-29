import { Hono } from 'hono'

const app = new Hono()

const authors = [
  {
    id: '1',
    name: 'John',
  },
  {
    id: '2',
    name: 'Jane',
  },
]

app.get('/', (c) => {
  return c.json(authors)
})

export default app
