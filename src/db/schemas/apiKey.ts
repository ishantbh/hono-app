import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { UserTable } from './user.ts'

export const ApiKeyTable = pgTable('api_keys', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => UserTable.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  keyHash: text('key_hash').notNull(),
  keyPrefix: varchar('key_prefix', { length: 8 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const ApiKeyRelations = relations(ApiKeyTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [ApiKeyTable.userId],
    references: [UserTable.id],
  }),
}))
