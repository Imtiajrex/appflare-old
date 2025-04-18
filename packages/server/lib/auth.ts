import { betterAuth } from 'better-auth'
import { admin, apiKey, bearer, jwt, organization } from 'better-auth/plugins'
import { DBClient } from './db'
import { openAPI } from './open-api'
import { mongodbAdapter } from './db-adapter/mongo-adapter'
import Config from './config'

export const auth = () => {
  const client = DBClient.connector
  const { config } = Config.getInstance()

  return betterAuth({
    basePath: '/api/v1/auth',
    database: mongodbAdapter('__appflare__', client),
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

    secondaryStorage: {
      get: async (key) => {
        const value = await config?.KV?.get(key)
        return value ? value : null
      },
      set: async (key, value, ttl) => {
        if (ttl)
          await config?.KV?.put(key, value, {
            expirationTtl: ttl,
          })
        // or for ioredis:
        // if (ttl) await redis.set(key, value, 'EX', ttl)
        else await config?.KV?.put(key, value)
      },
      delete: async (key) => {
        await config?.KV?.delete(key)
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
