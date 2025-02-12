import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: 'drizzle/migrations',
  schema: './schema',
  driver: 'd1-http',
  strict: true,
  verbose: true,
  dbCredentials: {
    accountId: 'my-account-id',
    databaseId: 'my-database-id',
    token: 'my-token',
  },
  dialect: 'sqlite',
})
