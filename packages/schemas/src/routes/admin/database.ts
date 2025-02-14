import { z } from 'zod'

export const listDocuments = {
  input: z.object({
    collectionName: z.string(),
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional(),
  }),
  output: z.object({
    data: z.array(z.any()),
    totalDocuments: z.number(),
  }),
}

export const createDocument = {
  input: z.object({
    collectionName: z.string(),
    document: z.any(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
}
