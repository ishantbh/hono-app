import { createMiddleware } from 'hono/factory'
import { eq } from 'drizzle-orm'

import { db } from '../db/db.ts'
import { ApiKeyTable, UserTable } from '../db/schema.ts'
import { hashApiKey } from '../lib/crypto.ts'

export type ApiKeyEnv = {
  Variables: {
    apiKeyUser: Pick<typeof UserTable.$inferSelect, 'id' | 'role' | 'email'>
  }
}

export const apiKeyAuth = createMiddleware<ApiKeyEnv>(async (c, next) => {
  const key = c.req.header('X-API-Key')

  if (!key || !key.trim().length) {
    return c.json({ error: 'Missing API key' }, 401)
  }

  const keyHash = hashApiKey(key)

  const apiKey = await db.query.ApiKeyTable.findFirst({
    where: eq(ApiKeyTable.keyHash, keyHash),
  })

  if (!apiKey) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, apiKey.userId),
    columns: {
      id: true,
      role: true,
      email: true,
    },
  })

  if (!user) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  c.set('apiKeyUser', user)

  await next()
})
