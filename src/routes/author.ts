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

app.get('/:id', (c) => {
  const { id } = c.req.param()

  const author = authors.find((a) => a.id === id)

  if (!author) {
    return c.json({ error: 'Author not found' }, 404)
  }

  return c.json(author)
})

export default app
