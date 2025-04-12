import { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import DatabaseController, {
  DatabaseRoutes,
} from 'controllers/database.controller'
import { HonoVariables } from 'lib/auth'
const databaseRoute = new OpenAPIHono<HonoVariables>()
  .openapi(DatabaseRoutes.listDocuments, DatabaseController.listDocuments)
  .openapi(DatabaseRoutes.insertDocument, DatabaseController.insertDocument)
  .openapi(DatabaseRoutes.updateDocument, DatabaseController.updateDocument)
  .openapi(DatabaseRoutes.deleteDocument, DatabaseController.deleteDocument)
  .doc('/swagger.json', {
    info: {
      title: 'Appflare Databases API',
      description: 'API for managing databases',
      version: '1.0.0',
    },
    openapi: '3.0.0',
    servers: [
      {
        url: '/api/v1/databases',
      },
    ],
  })
  .get(
    '/reference',
    Scalar({
      url: '/api/v1/databases/swagger.json',
    }),
  )
export default databaseRoute
