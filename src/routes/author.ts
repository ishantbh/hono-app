import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import z from 'zod'

const app = new Hono()

const authors = [
  {
    id: '1',
    name: 'John',
    birthday: new Date(),
  },
  {
    id: '2',
    name: 'Jane',
  },
]

const createAuthorSchema = z.object({
  name: z.string().min(1),
  birthday: z.coerce.date().optional(),
})

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

app.post('/', sValidator('json', createAuthorSchema), async (c) => {
  const data = c.req.valid('json')

  const body: { name: string } = await c.req.json()

  if (!body?.name) {
    return c.json({ error: 'Name is required' }, 401)
  }

  const author = {
    id: crypto.randomUUID(),
    ...data,
  }

  authors.push(author)

  return c.json(author, 201)
})

export default app
