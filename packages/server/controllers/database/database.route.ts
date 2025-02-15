import {
  createDatabaseSchema,
  createDocumentSchema,
  deleteDatabaseSchema,
  getDatabaseSchema,
  listDatabasesSchema,
  listDocumentsSchema,
  updateDocumentsSchema,
} from '@appflare/schemas'
import { DataBaseType } from '@appflare/schemas/src/db'
import DBService from '@appflare/services/db/db.service'
import { t } from 'lib/trpc'
import { TRPCError } from '@trpc/server'
export const databaseRouter = t.router({
  listDocuments: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        summary: 'List documents in a collection',
        path: '/database/listDocuments',
        tags: ['Database'],
      },
    })
    .input(listDocumentsSchema.input)
    .output(listDocumentsSchema.output)
    .query(async ({ input }) => {
      const { collectionId, limit, offset, databaseId } = input

      const dbService = new DBService(databaseId, collectionId)
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
        path: '/database/createDocument',
        tags: ['Database'],
      },
    })
    .input(createDocumentSchema.input)
    .output(createDocumentSchema.output)
    .query(async ({ input }) => {
      const { collectionId, document, databaseId } = input
      const dbService = new DBService(databaseId, collectionId)
      const result = await dbService.insertOne(document)

      return {
        success: !!result,
      }
    }),
  updateDocument: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        summary: 'Update a document in a collection',
        path: '/database/updateDocument',
        tags: ['Database'],
      },
    })
    .input(updateDocumentsSchema.input)
    .output(updateDocumentsSchema.output)
    .query(async ({ input }) => {
      const { collectionId, document, databaseId } = input
      const dbService = new DBService(databaseId, collectionId)
      const result = await dbService.insertOne(document)

      return {
        success: !!result,
      }
    }),
  deleteDocument: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        summary: 'Delete a document in a collection',
        path: '/database/deleteDocument',
        tags: ['Database'],
      },
    })
    .input(createDocumentSchema.input)
    .output(createDocumentSchema.output)
    .mutation(async ({ input }) => {
      const { collectionId, document, databaseId } = input
      const dbService = new DBService(databaseId, collectionId)
      const result = await dbService.insertOne(document)

      return {
        success: !!result,
      }
    }),
  listDatabases: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        summary: 'List databases',
        path: '/database/listDatabases',
        tags: ['Database'],
      },
    })
    .input(listDatabasesSchema.input)
    .output(listDatabasesSchema.output)
    .query(async () => {
      const dbService = new DBService<DataBaseType>('settings', 'databases')
      const result = await dbService.listMany({})
      return {
        databases: result.data,
        count: result.totalDocuments,
      }
    }),
  createDatabase: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        summary: 'Create a database',
        path: '/database/createDatabase',
        tags: ['Database'],
      },
    })
    .input(createDatabaseSchema.input)
    .output(createDatabaseSchema.output)
    .mutation(async ({ input }) => {
      const { name, id } = input
      const dbService = new DBService<DataBaseType>('settings', 'databases')
      const result = await dbService.insertOne({
        name: name,
        id: id,
      })
      return {
        success: !!result,
      }
    }),
  getDatabase: t.procedure
    .meta({
      openapi: {
        method: 'GET',
        summary: 'Get a database',
        path: '/database/getDatabase',
        tags: ['Database'],
      },
    })
    .input(getDatabaseSchema.input)
    .output(getDatabaseSchema.output)
    .query(async ({ input }) => {
      const { id } = input
      const dbService = new DBService<DataBaseType>('settings', 'databases')
      const result = await dbService.findOne({ id })
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Database not found',
        })
      }
      return result!
    }),
  deleteDatabase: t.procedure
    .meta({
      openapi: {
        method: 'POST',
        summary: 'Delete a database',
        path: '/database/deleteDatabase',
        tags: ['Database'],
      },
    })
    .input(deleteDatabaseSchema.input)
    .output(deleteDatabaseSchema.output)
    .mutation(async ({ input }) => {
      const { id } = input
      const dbService = new DBService<DataBaseType>('settings', 'databases')
      const result = await dbService.deleteOne({ id })
      return {
        success: !!result,
      }
    }),
})
