import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import {
  admin,
  apiKey,
  bearer,
  jwt,
  openAPI,
  organization,
} from 'better-auth/plugins'
import DBClient from './db'

export const auth = () => {
  const client = DBClient.getClient()
  const db = client.db('__appflare__')
  return betterAuth({
    basePath: '/api/v1/auth',
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        teamId: {
          type: 'string',
          required: false,
          references: {
            model: 'team',
            field: 'id',
          },
        },
        roles: {
          type: 'string',
          required: false,
        },
        tenantId: {
          type: 'string',
          required: false,
        },
      },
    },
    plugins: [
      jwt(),
      bearer(),
      apiKey(),
      organization(),
      admin({
        adminRoles: ['__superadmin__'],
      }),
      openAPI(),
    ],
  })
}

type AuthType = ReturnType<typeof auth>['$Infer']
type UserType = AuthType['Session']['user'] | null
type SessionType = AuthType['Session']['session'] | null
export type HonoVariables = {
  Variables: {
    user: UserType
    session: SessionType
  }
}
