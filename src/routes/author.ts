import { sValidator } from '@hono/standard-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import z from 'zod'

import { db } from '../db/db.ts'
import { AuthorTable } from '../db/schema.ts'

const app = new Hono()

const authors: {
  id: string
  name: string
  birthday?: Date | null
}[] = [
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

const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  birthday: z.coerce.date().nullable().optional(),
})

app.get('/', async (c) => {
  const authors = await db.query.AuthorTable.findMany()

  return c.json(authors)
})

app.get('/:id', async (c) => {
  const { id } = c.req.param()

  const author = await db.query.AuthorTable.findFirst({
    where: eq(AuthorTable.id, id),
  })

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

  const [author] = await db.insert(AuthorTable).values(data).returning()

  return c.json(author, 201)
})

app.put('/:id', sValidator('json', updateAuthorSchema), async (c) => {
  const { id } = c.req.param()

  const data = c.req.valid('json')

  const [author] = await db
    .update(AuthorTable)
    .set(data)
    .where(eq(AuthorTable.id, id))
    .returning()

  if (!author) {
    return c.json({ error: 'Author not found' }, 404)
  }

  return c.json(author)
})

app.delete('/:id', (c) => {
  const { id } = c.req.param()

  const index = authors.findIndex((a) => a.id === id)

  if (index === -1) {
    return c.json({ error: 'Author not found' }, 404)
  }

  authors.splice(index, 1)

  return c.body(null, 204)
})

export default app
