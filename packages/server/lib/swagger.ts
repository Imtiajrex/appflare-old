import appRouter from 'app'
import { generateOpenApiDocument } from 'trpc-swagger'

/* 👇 */
export const openApiDocument = (baseUrl: string) =>
  generateOpenApiDocument(appRouter, {
    title: 'AppFlare Backend API',
    version: '1.0.0', // consider making this pull version from package.json
    baseUrl, // consider making this dynamic
    tags: [],
  })
