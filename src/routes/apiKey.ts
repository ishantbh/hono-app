import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { eq } from 'drizzle-orm'

import { env } from '../data/env.ts'
import { db } from '../db/db.ts'
import { ApiKeyTable } from '../db/schema.ts'

type JwtEnv = {
  Variables: {
    jwtPayload: { sub: string; email: string; exp: number }
  }
}

const app = new Hono<JwtEnv>()

app.use(jwt({ secret: env.JWT_SECRET, alg: 'HS256' }))

app.get('/', async (c) => {
  const { sub: userId, email, exp } = c.var.jwtPayload

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

export default app
