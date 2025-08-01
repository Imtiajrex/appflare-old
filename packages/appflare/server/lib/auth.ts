import { betterAuth } from 'better-auth'
import { admin, apiKey, bearer, jwt, organization } from 'better-auth/plugins'
import { openAPI } from 'better-auth/plugins'
import Config from './config'

import { mongodbAdapter } from 'better-auth/adapters/mongodb'

import { withCloudflare } from 'better-auth-cloudflare'
import { getDatabase } from './mongo'
export const auth = () => {
  const config = Config.getInstance()
  const db = getDatabase('anglershield')
  return betterAuth({
    ...withCloudflare(
      {
        cf: config?.CF as any,
        autoDetectIpAddress: true,
        geolocationTracking: true,
        kv: config?.KV as any,
        // Optional: Enable R2 file storage
        r2: {
          bucket: config?.BUCKET as any,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          allowedTypes: [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.pdf',
            '.doc',
            '.docx',
          ],
          additionalFields: {
            category: { type: 'string', required: false },
            isPublic: { type: 'boolean', required: false },
            description: { type: 'string', required: false },
          },
        },
      },
      {
        emailAndPassword: {
          enabled: true,
        },
        rateLimit: {
          enabled: true,
        },
      },
    ),
    basePath: '/v1/api/auth',
    database: mongodbAdapter(db),
    trustedOrigins: ['anglershield://'],
    emailAndPassword: {
      enabled: true,
    },
    secondaryStorage: getKV(config?.KV),
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

const getKV = (KV?: KVNamespace) => {
  if (!KV) {
    return undefined
  }
  return {
    get: async (key: string) => {
      const value = await KV.get(key)
      return value ? value : null
    },
    set: async (key: string, value: any, ttl?: number) => {
      if (ttl) {
        await KV.put(key, value, {
          expirationTtl: ttl,
        })
      } else {
        await KV.put(key, value)
      }
    },
    delete: async (key: string) => {
      await KV.delete(key)
    },
  }
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
