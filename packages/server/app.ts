import { OpenAPIHono } from '@hono/zod-openapi'
import { auth, HonoVariables } from 'lib/auth'
import authRoute from 'routes/auth.route'
import databaseRoute from 'routes/database.route'

import { cors } from 'hono/cors'
import Elysia from 'elysia'
import { getHeaders } from 'lib/header'
const app = new OpenAPIHono<HonoVariables>()
  .basePath('/api/v1')
  .use(
    '*', // or replace with "*" to enable cors for all routes
    cors({
      origin: '*', // replace with your origin
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use('*', async (c, next) => {
    const session = await auth().api.getSession({
      headers: getHeaders(c.req.raw.headers),
    })

    if (!session) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return next()
  })
  .route('/auth', authRoute)
  .route('/databases', databaseRoute)

export default app
