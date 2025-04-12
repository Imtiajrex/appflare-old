import { createRoute, type RouteHandler } from '@hono/zod-openapi'
import { HonoVariables } from 'lib/auth'
import DatabaseSchemas from 'schemas/database.schema'
export const DatabaseRoutes = {
  listDocuments: createRoute({
    method: 'get',
    tags: ['Databases'],
    summary: 'List documents in a collection',
    path: '/listDocuments',
    request: {
      query: DatabaseSchemas.listDocuments.query,
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.listDocuments.output,
          },
        },
        description: 'Retrieve the user',
      },
    },
  }),
  insertDocument: createRoute({
    method: 'post',
    tags: ['Databases'],
    summary: 'Insert a document into a collection',
    path: '/insertDocument',
    request: {
      body: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.insertDocument.input,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.insertDocument.output,
          },
        },
        description: 'Document inserted successfully',
      },
    },
  }),
  updateDocument: createRoute({
    method: 'patch',
    tags: ['Databases'],
    summary: 'Update a document in a collection',
    path: '/updateDocument',
    request: {
      body: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.updateDocument.input,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.updateDocument.output,
          },
        },
        description: 'Document inserted successfully',
      },
    },
  }),

  deleteDocument: createRoute({
    method: 'delete',
    tags: ['Databases'],
    summary: 'Delete a document from a collection',

    path: '/deleteDocument',
    request: {
      query: DatabaseSchemas.deleteDocument.query,
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: DatabaseSchemas.deleteDocument.output,
          },
        },
        description: 'Document deleted successfully',
      },
    },
  }),
}
const DatabaseController = {
  listDocuments: (async (c) => {
    const { databaseId, collectionId } = c.req.query()
    return c.json({
      documents: [],
      message: 'Documents retrieved successfully',
      total: 0,
    })
  }) as RouteHandler<typeof DatabaseRoutes.listDocuments, HonoVariables>,
  insertDocument: (async (c) => {
    const { databaseId, collectionId, document } = c.req.valid('json')
    return c.json({
      message: 'Document inserted successfully',
      documentId: '123',
    })
  }) as RouteHandler<typeof DatabaseRoutes.insertDocument, HonoVariables>,
  updateDocument: (async (c) => {
    const { databaseId, collectionId, documentId, document } =
      c.req.valid('json')
    return c.json({
      message: 'Document updated successfully',
    })
  }) as RouteHandler<typeof DatabaseRoutes.updateDocument, HonoVariables>,
  deleteDocument: (async (c) => {
    const { databaseId, collectionId, documentId } = c.req.query()
    return c.json({
      message: 'Document deleted successfully',
    })
  }) as RouteHandler<typeof DatabaseRoutes.deleteDocument, HonoVariables>,
}
export default DatabaseController
