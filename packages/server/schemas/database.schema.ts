import { z } from '@hono/zod-openapi'
const DatabaseSchemas = {
  listDocuments: {
    query: z.object({
      databaseId: z.string().optional(),
      collectionId: z.string().optional(),
    }),
    output: z.object({
      message: z.string(),
      documents: z.array(z.any()),
      total: z.number(),
    }),
  },
  insertDocument: {
    input: z.object({
      databaseId: z.string(),
      collectionId: z.string(),
      document: z.object({}),
    }),
    output: z.object({
      message: z.string(),
      documentId: z.string(),
    }),
  },
  deleteDocument: {
    query: z.object({
      databaseId: z.string(),
      collectionId: z.string(),
      documentId: z.string(),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
  updateDocument: {
    input: z.object({
      databaseId: z.string(),
      collectionId: z.string(),
      documentId: z.string(),
      document: z.object({}),
    }),
    output: z.object({
      message: z.string(),
    }),
  },
}
export default DatabaseSchemas
