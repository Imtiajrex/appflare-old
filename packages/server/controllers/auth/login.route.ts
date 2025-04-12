import { signInInputSchema, signInOutputSchema } from '@appflare/schemas'
import { AuthService } from '@appflare/services'
import { signInEmail } from 'better-auth/api'
import { auth } from 'lib/auth'
import { t } from 'lib/trpc'

export const signInRoute = t.procedure
  .meta({
    openapi: {
      method: 'POST',
      summary: 'Sign in with an admin account',
      path: '/auth/signIn',
      tags: ['Authentication'],
    },
  })
  .input(signInInputSchema)
  .output(signInOutputSchema)
  .mutation(async ({ input }) => {
    const { email, password } = input
    const result = await auth().api.signInEmail({
      body: {
        email,
        password,
      },
    })

    return {
      token: result.token,
      user: result.user,
    }
  })
