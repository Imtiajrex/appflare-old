import Config from '@appflare/config'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { admin, organization } from 'better-auth/plugins'
import { MongoClient } from 'mongodb'

export const auth = () => {
  const config = Config.getInstance()
  const client = new MongoClient(config.config.MONGO_URI)
  const db = client.db('__appflare')
  return betterAuth({
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
      },
    },
    plugins: [
      admin({
        adminRoles: ['__superadmin'],
      }),
      organization(),
    ],
  })
}
