import { z } from 'zod'
import { dataBaseSchema } from '../../db'

export const listDocumentsSchema = {
  input: z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional(),
  }),
  output: z.object({
    data: z.array(z.any()),
    totalDocuments: z.number(),
  }),
}

export const createDocumentSchema = {
  input: z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    document: z.any(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
}

export const updateDocumentsSchema = {
  input: z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    document: z.any(),
    filter: z.any(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
}

export const deleteDocumentsSchema = {
  input: z.object({
    databaseId: z.string(),
    collectionId: z.string(),
    filter: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
}

export const listDatabasesSchema = {
  output: z.object({
    databases: z.array(dataBaseSchema.select),
    count: z.number(),
  }),
  input: z.object({
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
}

export const getDatabaseSchema = {
  input: z.object({
    id: z.string(),
  }),
  output: dataBaseSchema.select,
}
export const createDatabaseSchema = {
  input: dataBaseSchema.insert,
  output: z.object({
    success: z.boolean(),
  }),
}
export const deleteDatabaseSchema = {
  input: z.object({
    id: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
}
