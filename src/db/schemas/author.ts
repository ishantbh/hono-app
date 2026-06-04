import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { BookTable } from './book.ts'

export const AuthorTable = pgTable('authors', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  birthday: timestamp({ withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const AuthorRelations = relations(AuthorTable, ({ many }) => ({
  books: many(BookTable),
}))
