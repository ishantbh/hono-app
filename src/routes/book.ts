import { Hono } from 'hono'
import { eq } from 'drizzle-orm'

import { db } from '../db/db.ts'
import { BookTable } from '../db/schema.ts'

const app = new Hono()

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

export default app
