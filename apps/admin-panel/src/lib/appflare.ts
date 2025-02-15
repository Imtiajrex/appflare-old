import { AdminAuth, AdminClient, AdminDatabase } from '@appflare/admin-client'
export const client = new AdminClient({
  url: 'http://localhost:8787/api',
  apiKey: '',
})

export const auth = new AdminAuth(client)
export const db = new AdminDatabase(client, 'database')
