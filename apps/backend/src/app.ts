import { t } from 'lib/trpc'
import { adminRouter } from 'routes/admin/admin.route'

const appRouter = t.router({
  admin: adminRouter,
})
export default appRouter
