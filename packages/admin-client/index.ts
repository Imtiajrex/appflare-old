import { BetterFetch, createFetch, createSchema } from '@better-fetch/fetch'
import {
  createDocument,
  listDocuments,
  signInInputSchema,
  signInOutputSchema,
  signupInputSchema,
  signupOutputSchema,
} from '../schemas'
import { z } from 'zod'

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
const errorSchema = z.object({
  message: z.string(),
})
export class Client {
  url: string
  apiKey: string
  $fetch: BetterFetch<{
    schema: typeof fetchSchema
    errorSchema: typeof errorSchema
  }>

  constructor({ apiKey, url }: { url: string; apiKey: string }) {
    this.url = url
    this.apiKey = apiKey
    this.$fetch = createFetch({
      baseURL: url,
      schema: fetchSchema,
      errorSchema: z.object({
        message: z.string(),
        cause: z.object({
          message: z.string(),
        }),
      }),
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
        ...(limit ? { limit } : {}),
        ...(offset ? { offset } : {}),
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
