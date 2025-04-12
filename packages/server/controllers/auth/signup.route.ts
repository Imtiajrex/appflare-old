import { signupInputSchema, signupOutputSchema } from '@appflare/schemas'
import { auth } from 'lib/auth'
import { t } from 'lib/trpc'

export const signupRoute = t.procedure
  .meta({
    openapi: {
      method: 'POST',
      summary: 'Sign up for an account',
      path: '/auth/signup',
      tags: ['Authentication'],
    },
  })
  .input(signupInputSchema)
  .output(signupOutputSchema)
  .mutation(async ({ input }) => {
    const { email, password, name } = input
    // create user
    const accountCreationResult = await auth().api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    })
    return {
      token: accountCreationResult.token!,
    }
  })
