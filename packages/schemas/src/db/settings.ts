import { z } from 'zod'
import {
  createSchema,
  CreateSchemaType,
  createUnchangedSchema,
  CreateUnchangedSchemaType,
} from './schemas'

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
const databaseBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
})
const collectionBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
})
export const dataBaseSchema = createSchema(databaseBaseSchema)
export const collectionSchema = createSchema(collectionBaseSchema)

export const adminSchema = createSchema(adminBaseSchema)
export const adminSessionSchema = createUnchangedSchema(adminSessionBaseSchema)
export type DataBaseType = CreateSchemaType<typeof databaseBaseSchema>
export type CollectionType = CreateSchemaType<typeof collectionBaseSchema>
export type AdminType = CreateSchemaType<typeof adminBaseSchema>

export type AdminSessionType = CreateUnchangedSchemaType<
  typeof adminSessionBaseSchema
>
