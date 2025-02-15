import Config from '@appflare/config'
import DBClient from '@appflare/db'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import appRouter from 'app'
import { scalarUi } from 'lib/scalar-ui'
import { openApiDocument } from 'lib/swagger'
import { createContext } from 'lib/trpc'
import { Result } from 'neverthrow'
import { createOpenApiFetchHandler } from 'trpc-swagger'
declare global {
  type ResultType<T> = Result<T, string>
  type _APPFLARE_ENV = {
    MONGO_URI: string
    BUCKET?: R2Bucket
    KV?: KVNamespace
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  Allow: 'GET, POST, PATCH, DELETE, HEAD, OPTIONS',
}

export const server = async (request: Request, env: _APPFLARE_ENV) => {
  Config.initialize(env)
  await DBClient.connect()
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (request.url.includes('/swagger.json')) {
    const baseUrl = request.url.replace('/swagger.json', '/api')
    return Response.json(openApiDocument(baseUrl))
  }
  if (request.url.includes('/ui')) {
    const host = request.url.replace('/ui/', '').replace('/ui', '')
    return new Response(scalarUi(`${host}/swagger.json`), {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
  if (request.url.includes('/api')) {
    return createOpenApiFetchHandler({
      router: appRouter,
      createContext: createContext,
      onError: (opts) => {
        return opts
      },
      responseMeta: (opts) => {
        return {
          ...opts,
          headers: corsHeaders,
        }
      },
      endpoint: '/api',
      req: request,
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      },
    })
  }
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    createContext: createContext,
    router: appRouter,
    responseMeta: (opts) => {
      return {
        ...opts,
        headers: corsHeaders,
      }
    },
    onError: (opts) => {
      return opts
    },
  })
}
