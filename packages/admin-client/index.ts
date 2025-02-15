import { Auth, Client, ClientProps, Database } from '@appflare/client'
import { createFetch, RequestContext } from '@better-fetch/fetch'
import {
  createDatabaseSchema,
  deleteDatabaseSchema,
  listDatabasesSchema,
} from '@appflare/schemas/src/routes'
import { DataBaseType } from '@appflare/schemas/src/db'

export class AdminClient extends Client {
  constructor(props: ClientProps) {
    super(props)
    this.$fetch = createFetch({
      baseURL: props.url,
      onRequest: (context: RequestContext) => {
        context.headers.set('x-is-admin', 'true')
        return context
      },
    })
  }
}

export class AdminAuth extends Auth {}

export class AdminDatabase extends Database {
  async listDatabases() {
    return this.client.$fetch('/database/listDatabases', {
      method: 'GET',
      throw: true,
      output: listDatabasesSchema.output,
    })
  }
  async createDatabase(input: DataBaseType['insert']) {
    console.log(input)
    return this.client.$fetch('/database/createDatabase', {
      method: 'POST',
      body: input,
      throw: true,
      output: createDatabaseSchema.output,
    })
  }
  async deleteDatabase(databaseId: string) {
    return this.client.$fetch(`/database/deleteDatabase`, {
      method: 'POST',
      body: { databaseId },
      throw: true,
      output: deleteDatabaseSchema.output,
    })
  }
}
