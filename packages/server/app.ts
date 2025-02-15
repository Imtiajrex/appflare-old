import { authRouter } from 'controllers/auth/auth.route'
import { databaseRouter } from 'controllers/database/database.route'
import { t } from 'lib/trpc'

const appRouter = t.router({
  auth: authRouter,
  database: databaseRouter,
})
export default appRouter
