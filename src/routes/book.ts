import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { db } from '../db/db.ts'
import { AuthorTable, BookTable } from '../db/schema.ts'
import { apiKeyAuth, type ApiKeyEnv } from '../middleware/auth.ts'

const app = new Hono()

const protectedApp = new Hono<ApiKeyEnv>()
protectedApp.use(apiKeyAuth)

const createBookSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  publishDate: z.coerce.date().optional(),
  pageCount: z.number().int().positive().optional(),
  authorId: z.uuid(),
})

app.get('/', async (c) => {
  const books = await db.query.BookTable.findMany({ with: { author: true } })

  return c.json(books)
})

app.get('/:id', async (c) => {
  const { id } = c.req.param()

  const book = await db.query.BookTable.findFirst({
    where: eq(BookTable.id, id),
    with: { author: true },
  })

  if (!book) {
    return c.json({ error: 'Book not found' }, 404)
  }

  return c.json(book)
})

protectedApp.post('/', sValidator('json', createBookSchema), async (c) => {
  const { id: userId } = c.var.apiKeyUser

  const data = c.req.valid('json')

  const author = await db.query.AuthorTable.findFirst({
    where: eq(AuthorTable.id, data.authorId),
  })

  if (!author) {
    return c.json({ error: 'Author not found' }, 404)
  }

  const [book] = await db
    .insert(BookTable)
    .values({
      ...data,
      addedBy: userId,
    })
    .returning()

  return c.json(book, 201)
})

app.route('/', protectedApp)

export default app
