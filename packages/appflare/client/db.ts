import { Client } from './client'
export type DatabaseProps = {}
export class Database {
  client: Client
  constructor(client: Client, authProps?: DatabaseProps) {
    this.client = client
  }
}
