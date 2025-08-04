import { generateOpenApiDocument } from 'trpc-swagger'
import { appRouter } from '../routers/admin'

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Appflare Admin Database API',
  description: 'API for managing databases and collections in Appflare',
  version: '1.0.0',
  baseUrl: '/v1/api/admin/databases/',
  tags: ['Admin Database'],
})

export { appRouter }
