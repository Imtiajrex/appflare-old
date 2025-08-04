import { router, adminProcedure } from '../../lib/trpc'
import { getCollection } from '../../lib/mongo'
import {
  listDocumentsSchema,
  createDocumentSchema,
  updateDocumentsSchema,
  deleteDocumentsSchema,
} from '@appflare/schemas'

export const documentManagementRouter = router({
  // List documents in a collection
  listDocuments: adminProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/list-documents/{databaseId}/{collectionId}',
        tags: ['Document Management'],
        summary: 'List documents in a collection',
        description:
          'Get paginated list of documents from a specific collection',
      },
    })
    .input(listDocumentsSchema.input)
    .output(listDocumentsSchema.output)
    .query(async ({ input }) => {
      const { databaseId, collectionId, limit = 10, offset = 0 } = input

      try {
        const collection = getCollection(collectionId)

        // Get documents with pagination
        const documents = await collection
          .find({})
          .skip(offset)
          .limit(limit)
          .toArray()

        // Get total count
        const totalDocuments = await collection.countDocuments({})

        return {
          data: documents,
          totalDocuments,
        }
      } catch (error) {
        console.error('Error listing documents:', error)
        throw new Error('Failed to list documents')
      }
    }),

  // Create document
  createDocument: adminProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/create-document/{databaseId}/{collectionId}',
        tags: ['Document Management'],
        summary: 'Create a new document',
        description: 'Create a new document in the specified collection',
      },
    })
    .input(createDocumentSchema.input)
    .output(createDocumentSchema.output)
    .mutation(async ({ input }) => {
      const { databaseId, collectionId, document } = input

      try {
        const collection = getCollection(collectionId)

        await collection.insertOne({
          ...document,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return { success: true }
      } catch (error) {
        console.error('Error creating document:', error)
        throw new Error('Failed to create document')
      }
    }),

  // Update documents
  updateDocuments: adminProcedure
    .meta({
      openapi: {
        method: 'PATCH',
        path: '/update-documents/{databaseId}/{collectionId}',
        tags: ['Document Management'],
        summary: 'Update documents',
        description:
          'Update documents in a collection based on filter criteria',
      },
    })
    .input(updateDocumentsSchema.input)
    .output(updateDocumentsSchema.output)
    .mutation(async ({ input }) => {
      const { databaseId, collectionId, document, filter } = input

      try {
        const collection = getCollection(collectionId)

        await collection.updateMany(filter, {
          $set: {
            ...document,
            updatedAt: new Date(),
          },
        })

        return { success: true }
      } catch (error) {
        console.error('Error updating documents:', error)
        throw new Error('Failed to update documents')
      }
    }),

  // Delete documents
  deleteDocuments: adminProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/delete-documents/{databaseId}/{collectionId}',
        tags: ['Document Management'],
        summary: 'Delete documents',
        description:
          'Delete documents from a collection based on filter criteria',
      },
    })
    .input(deleteDocumentsSchema.input)
    .output(deleteDocumentsSchema.output)
    .mutation(async ({ input }) => {
      const { collectionId, filter } = input

      try {
        const collection = getCollection(collectionId)

        await collection.deleteMany(JSON.parse(filter))

        return { success: true }
      } catch (error) {
        console.error('Error deleting documents:', error)
        throw new Error('Failed to delete documents')
      }
    }),
})
