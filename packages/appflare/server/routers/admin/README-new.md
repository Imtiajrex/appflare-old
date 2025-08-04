# tRPC Admin Database API

This module provides a modular and composable tRPC-based API for managing databases, collections, and documents in Appflare, with full OpenAPI documentation support.

## Architecture Overview

The admin API has been restructured into separate, composable routers for better maintainability and flexibility:

### Modular Router Structure

```
admin/
├── database-management.router.ts     # Database CRUD operations
├── document-management.router.ts     # Document CRUD operations
├── collection-management.router.ts   # Collection CRUD operations
├── admin-database.router.ts          # Composed router (backward compatibility)
└── index.ts                         # Main exports and router composition
```

### Router Composition Options

#### 1. Modular Approach (Recommended)

Use separate routers for each management feature:

```typescript
import { appRouter } from './routers/admin'

// Access endpoints via:
// - appRouter.databases.*     (database management)
// - appRouter.documents.*     (document management)
// - appRouter.collections.*   (collection management)
```

#### 2. Legacy Approach (Backward Compatibility)

Use the composed router that maintains the original API structure:

```typescript
import { legacyAppRouter } from './routers/admin'

// Access endpoints via:
// - legacyAppRouter.adminDatabase.*  (all operations in one namespace)
```

#### 3. Individual Router Imports

Import specific routers as needed:

```typescript
import {
  databaseManagementRouter,
  documentManagementRouter,
  collectionManagementRouter,
} from './routers/admin'

// Use individual routers in your own compositions
```

## Features

- **Type-safe API**: Full TypeScript support with automatic type inference
- **OpenAPI Documentation**: Auto-generated Swagger/OpenAPI docs with proper tagging
- **Modular Architecture**: Separate concerns into focused, reusable routers
- **Backward Compatibility**: Legacy API structure maintained via composed router
- **Interactive API Explorer**: Scalar API reference UI
- **Authentication**: Protected endpoints with admin middleware

## API Endpoints

### Database Management (`databases` namespace)

- `GET /admin/databases` - List all databases
- `GET /admin/databases/{id}` - Get database by ID
- `POST /admin/databases` - Create a new database
- `DELETE /admin/databases/{id}` - Delete a database

### Document Management (`documents` namespace)

- `GET /admin/databases/{databaseId}/collections/{collectionId}/documents` - List documents
- `POST /admin/databases/{databaseId}/collections/{collectionId}/documents` - Create document
- `PATCH /admin/databases/{databaseId}/collections/{collectionId}/documents` - Update documents
- `DELETE /admin/databases/{databaseId}/collections/{collectionId}/documents` - Delete documents

### Collection Management (`collections` namespace)

- `GET /admin/databases/{databaseId}/collections` - List collections in database
- `GET /admin/databases/{databaseId}/collections/{collectionId}` - Get collection by ID
- `POST /admin/databases/{databaseId}/collections` - Create a new collection
- `DELETE /admin/databases/{databaseId}/collections/{collectionId}` - Delete a collection

## Usage Examples

### Server-side (Hono)

The modular routers are integrated into the Hono app:

```typescript
import { appRouter } from './routers/admin'

// Use the modular approach
app.route('/admin/*', createAdminRoute(appRouter))

// Or use legacy approach for backward compatibility
app.route('/admin/databases/*', adminDatabaseRoute)
```

### Client-side with Modular Approach

```typescript
import { createAppflareClient } from 'appflare/client'

const client = createAppflareClient({
  baseUrl: 'https://your-api.example.com',
  getToken: () => localStorage.getItem('auth-token'),
})

// Database operations
const databases = await client.databases.listDatabases.query({
  limit: 10,
  offset: 0,
})

// Document operations
await client.documents.createDocument.mutate({
  databaseId: 'db1',
  collectionId: 'users',
  document: { name: 'John Doe', email: 'john@example.com' },
})

// Collection operations
const collections = await client.collections.listCollections.query({
  databaseId: 'db1',
})
```

### Client-side with Legacy Approach

```typescript
// Maintain existing API calls
const databases = await client.adminDatabase.listDatabases.query({
  limit: 10,
  offset: 0,
})
```

## Migration Guide

### From Monolithic to Modular

If you're currently using the `adminDatabase` namespace, you have two options:

#### Option 1: Update to Modular Approach (Recommended)

**Before:**

```typescript
client.adminDatabase.listDatabases.query()
client.adminDatabase.createDocument.mutate()
```

**After:**

```typescript
client.databases.listDatabases.query()
client.documents.createDocument.mutate()
```

#### Option 2: Use Legacy Router (No Changes Required)

Import `legacyAppRouter` instead of `appRouter` to maintain existing API structure.

## API Documentation

### OpenAPI Tags

- **Database Management**: Database CRUD operations
- **Document Management**: Document CRUD operations
- **Collection Management**: Collection CRUD operations

### Interactive Documentation

Visit `/v1/api/admin/databases/docs` to access the interactive API documentation.

### Specifications

- JSON format: `/v1/api/admin/databases/docs/openapi.json`
- Interactive UI: `/v1/api/admin/databases/docs`

## Authentication

All endpoints require admin authentication. The middleware checks for:

1. Valid user session
2. Admin privileges (configurable in `lib/trpc.ts`)

## Error Handling

The API uses tRPC's built-in error handling with proper HTTP status codes:

- `401` for unauthorized access
- `400` for invalid input
- `500` for server errors

## Development

### Adding New Features

#### To Database Management

Add procedures to `database-management.router.ts`:

```typescript
export const databaseManagementRouter = router({
  // existing procedures...

  newDatabaseFeature: adminProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/databases/new-feature',
        tags: ['Database Management'],
        summary: 'New database feature',
      },
    })
    .input(z.object({ param: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      // Implementation
      return { success: true }
    }),
})
```

#### To Document Management

Add procedures to `document-management.router.ts` following the same pattern.

#### To Collection Management

Add procedures to `collection-management.router.ts` following the same pattern.

### Creating New Management Areas

1. Create a new router file (e.g., `user-management.router.ts`)
2. Add it to the main router in `index.ts`
3. Update the composed router if backward compatibility is needed

## Benefits of Modular Architecture

1. **Separation of Concerns**: Each router handles a specific domain
2. **Easier Testing**: Test individual management features in isolation
3. **Better Code Organization**: Logical grouping of related operations
4. **Flexible Composition**: Mix and match routers as needed
5. **Maintainability**: Easier to modify or extend specific features
6. **Team Development**: Different teams can work on different management areas

## Testing

You can test the API using:

1. The interactive Scalar documentation (organized by management area)
2. Any HTTP client (curl, Postman, etc.)
3. The type-safe tRPC client with either modular or legacy approach

## Security

- All endpoints are protected by authentication middleware
- Input validation using Zod schemas
- Proper error handling without exposing internal details
- Granular permissions can be added at the router level
