import { Column, Table, TableConfig } from 'drizzle-orm'
import { SQLiteTable, SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'

export const createSchema = <T extends TableConfig>(
  table: SQLiteTableWithColumns<T>,
) => {
  return {
    select: createSelectSchema(table),
    insert: createInsertSchema(table),
    update: createUpdateSchema(table),
  }
}
