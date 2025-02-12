import { createDocument, listDocuments } from '@appflare/schemas'
import NoSQLService from '@appflare/services/nosql.service'
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
    .input(listDocuments.input)
    .output(listDocuments.output)
    .query(async ({ input }) => {
      const { collectionName, limit, offset } = input

      const dbService = new NoSQLService('database')
      const result = await dbService.listDocuments({
        collectionName,
        limit,
        offset,
      })
      return {
        data: result.data,
        totalDocuments: result.count,
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
    .input(createDocument.input)
    .output(createDocument.output)
    .query(async ({ input }) => {
      const { collectionName, document } = input
      const dbService = new NoSQLService('database')
      const result = await dbService.createDocument(collectionName, document)

      return {
        success: !!result,
      }
    }),
})
