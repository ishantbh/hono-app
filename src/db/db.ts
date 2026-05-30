import { env } from '../data/env.ts'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.ts'

export const db = drizzle(env.DATABASE_URL, {
  schema,
})
