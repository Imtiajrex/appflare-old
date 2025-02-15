import { z } from 'zod'

const adminBaseSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})
const adminSessionBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
})

const selectBaseSchema = z.object({
  _id: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
const createSchema = <TSchema extends Record<string, z.ZodTypeAny>>(
  schema: z.ZodObject<TSchema>,
) => ({
  select: schema.merge(selectBaseSchema),
  insert: schema,
  update: schema.partial(),
})
const createUnchangedSchema = <TSchema extends Record<string, z.ZodTypeAny>>(
  schema: z.ZodObject<TSchema>,
) => ({
  select: schema,
  insert: schema,
  update: schema.partial(),
})

export const adminSchema = createSchema(adminBaseSchema)
export const adminSessionSchema = createUnchangedSchema(adminSessionBaseSchema)

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
export type AdminType = CreateSchemaType<typeof adminBaseSchema>

export type AdminSessionType = CreateUnchangedSchemaType<
  typeof adminSessionBaseSchema
>
