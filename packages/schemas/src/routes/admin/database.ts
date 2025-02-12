import { z } from 'zod'

export const listDocuments = {
  input: z.object({
    collectionName: z.string(),
    limit: z.number().optional(),
    offset: z.number().optional(),
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
