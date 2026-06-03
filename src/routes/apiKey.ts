import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { sValidator } from '@hono/standard-validator'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { env } from '../data/env.ts'
import { db } from '../db/db.ts'
import { ApiKeyTable } from '../db/schema.ts'
import { generateApiKey } from '../lib/crypto.ts'

type JwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number }
  }
}

const app = new Hono<JwtEnv>()

const createKeySchema = z.object({
  name: z.string().min(1).max(255),
})

app.use(jwt({ secret: env.JWT_SECRET, alg: 'HS256' }))

app.get('/', async (c) => {
  const { sub: userId } = c.var.jwtPayload

  const keys = await db.query.ApiKeyTable.findMany({
    where: eq(ApiKeyTable.userId, userId),
    columns: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
    },
  })

  return c.json(keys)
})

app.post('/', sValidator('json', createKeySchema), async (c) => {
  const { sub: userId } = c.var.jwtPayload
  const { name } = c.req.valid('json')
  const { raw, prefix, hash } = generateApiKey()

  const [apiKey] = await db
    .insert(ApiKeyTable)
    .values({
      name,
      userId,
      keyHash: hash,
      keyPrefix: prefix,
    })
    .returning({
      id: ApiKeyTable.id,
    })

  return c.json({ key: raw, id: apiKey.id }, 201)
})

export default app
