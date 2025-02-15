import { createDocumentSchema, listDocumentsSchema } from '@appflare/schemas'
import DBService from '@appflare/services/db/db.service'
import { t } from 'lib/trpc'
export const databaseRouter = t.router({
  listDocuments: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        summary: 'List documents in a collection',
        path: '/admin/database/listDocuments',
        tags: ['Admin Database'],
      },
    })
    .input(listDocumentsSchema.input)
    .output(listDocumentsSchema.output)
    .query(async ({ input }) => {
      const { collectionName, limit, offset } = input

      const dbService = new DBService('database', collectionName)
      const result = await dbService.listMany({
        limit,
        offset,
      })
      return {
        data: result.data,
        totalDocuments: result.totalDocuments,
      }
    }),
  createDocument: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        summary: 'Create a document in a collection',
        path: '/admin/database/createDocument',
        tags: ['Admin Database'],
      },
    })
    .input(createDocumentSchema.input)
    .output(createDocumentSchema.output)
    .query(async ({ input }) => {
      const { collectionName, document } = input
      const dbService = new DBService('database', collectionName)
      const result = await dbService.insertOne(document)

      return {
        success: !!result,
      }
    }),
})
