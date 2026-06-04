import { Hono } from 'hono'

import { db } from '../db/db.ts'

const app = new Hono()

app.get('/', async (c) => {
  const books = await db.query.BookTable.findMany({ with: { author: true } })

  return c.json(books)
})

export default app
