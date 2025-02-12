import { BetterFetch, createFetch, createSchema } from '@better-fetch/fetch'
import {
  createDocument,
  listDocuments,
  signInInputSchema,
  signInOutputSchema,
  signupInputSchema,
  signupOutputSchema,
} from '../schemas'

const fetchSchema = createSchema({
  '/admin/auth/signin': {
    input: signInInputSchema,
    output: signInOutputSchema,
  },
  '/admin/auth/signup': {
    input: signupInputSchema,
    output: signupOutputSchema,
  },
  'admin/database/listDocuments': listDocuments,
  'admin/database/createDocument': createDocument,
})
export class Client {
  url: string
  apiKey: string
  $fetch: BetterFetch<{
    schema: typeof fetchSchema
  }>

  constructor({ apiKey, url }: { url: string; apiKey: string }) {
    this.url = url
    this.apiKey = apiKey
    this.$fetch = createFetch({
      baseURL: url,
      retry: {
        type: 'linear',
        attempts: 3,
        delay: 1000,
      },
      schema: fetchSchema,
    })
  }
}

type ExtraConfig = {
  throw?: boolean
}
export class Auth {
  client: Client
  constructor(client: Client) {
    this.client = client
  }
  async signInWithEmailAndPassword(
    email: string,
    password: string,
    extraConfig?: ExtraConfig,
  ) {
    return this.client.$fetch('/admin/auth/signin', {
      method: 'POST',
      body: {
        email,
        password,
      },
      throw: true,
    })
  }
  async signUpWithEmailAndPassword<T extends ExtraConfig>(
    email: string,
    password: string,
    name: string,
    extraConfig?: ExtraConfig,
  ) {
    return this.client.$fetch('/admin/auth/signup', {
      method: 'POST',
      body: {
        email,
        password,
        name,
      },
      throw: true,
    })
  }
}

export class Database {
  client: Client
  databaseName: string
  constructor(client: Client, databaseName: string) {
    this.client = client
    this.databaseName = databaseName
  }
  async listDocuments({
    collectionName,

    limit,
    offset,
  }: {
    collectionName: string
    limit?: number
    offset?: number
  }) {
    return this.client.$fetch('/admin/database/listDocuments', {
      query: {
        collectionName,
        limit,
        offset,
      },
      throw: true,
    })
  }
  async createDocument({
    collectionName,
    document,
  }: {
    collectionName: string
    document: any
  }) {
    return this.client.$fetch('/admin/database/createDocument', {
      method: 'POST',
      body: {
        collectionName,
        document,
      },
      throw: true,
    })
  }
}
