import { hc } from 'hono/client'
import { ServerType } from '../server/app'

export type ClientProps = {
  url: string
}
export class Client {
  url: string
  honoClient: typeof hc<ServerType>
  constructor({ url }: ClientProps) {
    this.url = url
    this.honoClient = hc<ServerType>(url) as any
  }
}
