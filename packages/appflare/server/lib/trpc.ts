import { initTRPC } from '@trpc/server'
import { OpenApiMeta } from 'trpc-swagger'
import { HonoVariables } from './auth'
import type { Context } from 'hono'

export interface TRPCContext {
  c: Context<HonoVariables>
}

const t = initTRPC.meta<OpenApiMeta>().context<TRPCContext>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

// Create authenticated middleware
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const user = ctx.c.get('user')
  const session = ctx.c.get('session')

  if (!user || !session) {
    throw new Error('Unauthorized')
  }

  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  })
})

// Create admin middleware - for now, just check if user exists
// You can enhance this based on your specific admin role logic
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = ctx.user

  // For now, just check if user exists
  // You can add additional role checks here based on your auth system
  if (!user) {
    throw new Error('Admin access required')
  }

  return next({
    ctx,
  })
})
