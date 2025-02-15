import { BetterFetch, createFetch, createSchema } from '@better-fetch/fetch'
import { z } from 'zod'
import {
  createDocumentSchema,
  listDocumentsSchema,
  signInInputSchema,
  signInOutputSchema,
  signupInputSchema,
  signupOutputSchema,
} from '../schemas'

const paths = {
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
  },
  database: {
    listDocuments: '/database/listDocuments',
    createDocument: '/database/createDocument',
  },
} as const
export const fetchSchema = createSchema({
  [paths.auth.signin]: {
    input: signInInputSchema,
    output: signInOutputSchema,
  },
  [paths.auth.signup]: {
    input: signupInputSchema,
    output: signupOutputSchema,
  },
  [paths.database.listDocuments]: {
    query: listDocumentsSchema.input,
    output: listDocumentsSchema.output,
  },
  [paths.database.createDocument]: createDocumentSchema,
})
const errorSchema = z.object({
  message: z.string(),
})
export type ClientProps = {
  apiKey: string
  url: string
}
export class Client {
  url: string
  apiKey: string
  $fetch: BetterFetch<{
    schema: typeof fetchSchema
    errorSchema: typeof errorSchema
  }>

  constructor({ apiKey, url }: ClientProps) {
    this.url = url
    this.apiKey = apiKey
    this.$fetch = createFetch({
      baseURL: url,
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
    return this.client.$fetch(paths.auth.signin, {
      method: 'POST',
      body: {
        email,
        password,
      },
      throw: true,
    })
  }
  async signUpWithEmailAndPassword(
    email: string,
    password: string,
    name: string,
    extraConfig?: ExtraConfig,
  ) {
    return this.client.$fetch(paths.auth.signup, {
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
  databaseId: string
  constructor(client: Client, databaseId: string) {
    this.client = client
    this.databaseId = databaseId
  }
  async listDocuments({
    collectionId,
    limit,
    offset,
  }: {
    collectionId: string
    limit?: number
    offset?: number
  }) {
    return this.client.$fetch(paths.database.listDocuments, {
      query: {
        databaseId: this.databaseId,
        collectionId,
        ...(limit ? { limit } : {}),
        ...(offset ? { offset } : {}),
      },
      throw: true,
    })
  }
  async createDocument({
    collectionId,
    document,
  }: {
    collectionId: string
    document: any
  }) {
    return this.client.$fetch(paths.database.createDocument, {
      method: 'POST',
      body: {
        databaseId: this.databaseId,
        collectionId,
        document,
      },
      throw: true,
    })
  }
}
