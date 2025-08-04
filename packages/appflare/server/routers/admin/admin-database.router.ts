import { router } from '../../lib/trpc'
import { databaseManagementRouter } from './database-management.router'
import { documentManagementRouter } from './document-management.router'
import { collectionManagementRouter } from './collection-management.router'

// Composed admin database router that combines all management features
// This maintains backward compatibility while providing modular organization
export const adminDatabaseRouter = router({
  // Database management operations
  ...databaseManagementRouter._def.record,

  // Document management operations
  ...documentManagementRouter._def.record,

  // Collection management operations (optional, for future use)
  ...collectionManagementRouter._def.record,
})
