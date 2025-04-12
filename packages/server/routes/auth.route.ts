import { Hono } from 'hono'
import { auth, HonoVariables } from 'lib/auth'
import { getHeaders } from 'lib/header'

const authRoute = new Hono<HonoVariables>().on(
  ['POST', 'GET'],
  '/*',
  async (c) => {
    const newRequest = new Request(c.req.raw, {
      headers: getHeaders(c.req.raw.headers),
    })
    return auth().handler(newRequest)
  },
)
export default authRoute
