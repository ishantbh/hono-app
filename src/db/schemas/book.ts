import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { AuthorTable } from './author.ts'
import { UserTable } from './user.ts'

export const BookTable = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  publishDate: timestamp('publish_date', { withTimezone: true }),
  pageCount: integer('page_count'),
  authorId: uuid('author_id')
    .notNull()
    .references(() => AuthorTable.id, { onDelete: 'cascade' }),
  addedBy: uuid('added_by')
    .notNull()
    .references(() => UserTable.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const BookRelations = relations(BookTable, ({ one }) => ({
  author: one(AuthorTable, {
    fields: [BookTable.authorId],
    references: [AuthorTable.id],
  }),

  addedBy: one(UserTable, {
    fields: [BookTable.addedBy],
    references: [UserTable.id],
  }),
}))
