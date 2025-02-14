import { AuthService } from '@appflare/services'
import { signInInputSchema, signInOutputSchema } from '@appflare/schemas'
import { t } from 'lib/trpc'
import { TRPCError } from '@trpc/server'

export const signInRoute = t.procedure
  .meta({
    openapi: {
      method: 'POST',
      summary: 'Sign in with an admin account',
      path: '/admin/auth/signIn',
      tags: ['Admin Authentication'],
    },
  })
  .input(signInInputSchema)
  .output(signInOutputSchema)
  .mutation(async ({ input }) => {
    const { email, password } = input
    // create user
    const authService = new AuthService()
    const result = await authService.signInWithEmailAndPassword({
      email,
      password,
    })
    if (result.isErr()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid email or password',
      })
    }

    return result.value
  })
