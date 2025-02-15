import { Auth, Client, Database } from '@appflare/client'
export const client = new Client({
  url: 'http://localhost:8787/api',
  apiKey: '',
})

export const auth = new Auth(client)
export const db = new Database(client, 'database')
