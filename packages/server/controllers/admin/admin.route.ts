import { t } from 'lib/trpc'
import { authRouter } from './auth/auth.route'
import { databaseRouter } from './database/database.route'

export const adminRouter = t.router({
  auth: authRouter,
  database: databaseRouter,
})
