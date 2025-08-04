import { router } from '../../lib/trpc'
import { collectionManagementRouter } from './collection-management.router'
import { databaseManagementRouter } from './database-management.router'
import { documentManagementRouter } from './document-management.router'

// Modular approach - separate routers for each management feature
export const appRouter = router({
  databases: databaseManagementRouter,
  documents: documentManagementRouter,
  collections: collectionManagementRouter,
})

export type AppRouter = typeof appRouter
export type LegacyAppRouter = typeof appRouter
