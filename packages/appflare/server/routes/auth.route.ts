import { Hono } from 'hono'
import { auth } from '../lib/auth'
import { getSanitizedRequest } from '../lib/request'

const authRoute = new Hono()

authRoute.on(['POST', 'GET'], '/*', (c) => {
  return auth().handler(getSanitizedRequest(c.req.raw))
})

export { authRoute }
