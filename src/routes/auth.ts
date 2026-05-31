import { sValidator } from '@hono/standard-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import z from 'zod'

import { db } from '../db/db.ts'
import { UserTable } from '../db/schema.ts'
import { hashPassword } from '../lib/crypto.ts'

const app = new Hono()

const registerSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
})

app.post('/register', sValidator('json', registerSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  const existing = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  })

  if (existing) {
    return c.json({ error: 'Email already in use' }, 409)
  }

  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(UserTable)
    .values({
      email,
      passwordHash,
    })
    .returning({
      id: UserTable.id,
      email: UserTable.email,
    })

  return c.json({ user }, 201)
})

export default app
