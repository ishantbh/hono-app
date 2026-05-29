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

app.post('/', async (c) => {
  const body: { name: string } = await c.req.json()

  if (!body?.name) {
    return c.json({ error: 'Name is required' }, 401)
  }

  if (body.name.length < 2) {
    return c.json({ error: 'Name must be at least 2 characters long' }, 401)
  }

  const newAuthor = {
    id: authors.length.toString(),
    name: body.name,
  }

  authors.push(newAuthor)

  return c.json(newAuthor, 201)
})

export default app
