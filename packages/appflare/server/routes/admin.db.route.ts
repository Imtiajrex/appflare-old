import { Hono } from 'hono'
import { appRouter } from '../routers/admin'
import { HonoVariables } from '../lib/auth'
import type { TRPCContext } from '../lib/trpc'
import { createOpenApiFetchHandler } from 'trpc-swagger'
import { openApiDocument } from '../lib/trpc-openapi'

const adminDatabaseRoute = new Hono<HonoVariables>()

// Create tRPC context function
const createContext = (c: any): TRPCContext => {
  return { c }
}

// Handle tRPC requests (this should come after the docs route)
adminDatabaseRoute.all('/*', async (c) => {
  if (c.req.url.includes('/swagger.json')) {
    return Response.json(openApiDocument)
  }
  if (c.req.url.includes('/ui')) {
    const host = c.req.url.replace('/ui/', '').replace('/ui', '')
    return new Response(swaggerHtml(`${host}/swagger.json`), {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }

  const response = await createOpenApiFetchHandler({
    router: appRouter,
    createContext: () => createContext(c),
    endpoint: '/v1/api/admin/databases',
    req: c.req.raw,
  })

  return response
})

export { adminDatabaseRoute }

const swaggerHtml = (path: string) => `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body> <script
      id="api-reference"
	  	data-url="${path}"
	  ></script>
    <script>

    </script>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`
