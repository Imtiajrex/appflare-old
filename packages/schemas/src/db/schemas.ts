import { z } from 'zod'

const selectBaseSchema = z.object({
  _id: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export const createSchema = <TSchema extends Record<string, z.ZodTypeAny>>(
  schema: z.ZodObject<TSchema>,
) => ({
  select: schema.merge(selectBaseSchema),
  insert: schema,
  update: schema.partial(),
})
export const createUnchangedSchema = <
  TSchema extends Record<string, z.ZodTypeAny>,
>(
  schema: z.ZodObject<TSchema>,
) => ({
  select: schema,
  insert: schema,
  update: schema.partial(),
})

export type CreateSchemaType<T extends z.ZodTypeAny> = {
  select: z.infer<T> & { _id: string; createdAt: Date; updatedAt: Date }
  insert: z.infer<T>
  update: Partial<z.infer<T>>
}
export type CreateUnchangedSchemaType<T extends z.ZodTypeAny> = {
  select: z.infer<T>
  insert: z.infer<T>
  update: Partial<z.infer<T>>
}
