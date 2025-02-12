import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { createSchema } from '../utils'

export const userTable = sqliteTable('_superUsers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
})

export const sessionTable = sqliteTable('_superUserSessions', {
  id: text('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
})

export const userSchema = createSchema(userTable)
export const sessionSchema = createSchema(sessionTable)
export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
export type UserTypes = {
  select: User
  insert: InferInsertModel<typeof userTable>
  update: User
}
