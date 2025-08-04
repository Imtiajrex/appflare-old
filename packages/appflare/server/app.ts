import { OpenAPIHono } from '@hono/zod-openapi'

import { cors } from 'hono/cors'
import { authRoute } from './routes/auth.route'
import { auth, HonoVariables } from './lib/auth'
import { databaseRoute } from './routes/database.route'
import { adminDatabaseRoute } from './routes/admin.db.route'
const app = new OpenAPIHono<HonoVariables>()
  .basePath('/v1/api')
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
  .route('/auth/*', authRoute)
  .use('*', async (c, next) => {
    const session = await auth().api.getSession(c.req.raw)

    if (!session) {
      c.set('user', null)
      c.set('session', null)
      return next()
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return next()
  })
  .route('/databases/*', databaseRoute)
  .route('/admin/databases/*', adminDatabaseRoute)

export default app
export type ServerType = typeof app
