import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../server/routers'

export function createAppflareClient(config: {
  baseUrl: string
  getToken?: () => string | Promise<string>
}) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${config.baseUrl}/v1/api/admin/databases`,
        headers: async () => {
          const token = await config.getToken?.()
          return token ? { Authorization: `Bearer ${token}` } : {}
        },
      }),
    ],
  })
}

export type AppflareClient = ReturnType<typeof createAppflareClient>
