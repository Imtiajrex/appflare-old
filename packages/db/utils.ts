import { TableConfig } from 'drizzle-orm'
import { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod'

export const createSchema = <T extends TableConfig>(
  table: SQLiteTableWithColumns<T>,
) => {
  return {
    select: createSelectSchema(table).merge(
      z.object({
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    ),
    insert: createInsertSchema(table),
    update: createUpdateSchema(table),
  }
}
