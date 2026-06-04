import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { ApiKeyTable } from './apiKey.ts'
import { BookTable } from './book.ts'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])

export const UserTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum().notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const userRelations = relations(UserTable, ({ many }) => ({
  apiKeys: many(ApiKeyTable),

  booksAdded: many(BookTable),
}))
