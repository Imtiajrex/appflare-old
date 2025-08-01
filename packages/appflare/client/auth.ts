import { Client } from './client'
import { createAuthClient } from 'better-auth/client'
export type AuthProps = {}
export class Auth {
  client: Client
  authClient: ReturnType<typeof createAuthClient>
  constructor(client: Client, authProps?: AuthProps) {
    this.client = client
    this.authClient = createAuthClient({
      baseURL: client.url,
    })
  }
  get() {
    return this.authClient
  }
}
