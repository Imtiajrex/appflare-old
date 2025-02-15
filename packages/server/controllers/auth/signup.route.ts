import { AuthService } from '@appflare/services'
import { t } from 'lib/trpc'
import { signupInputSchema, signupOutputSchema } from '@appflare/schemas'
import { TRPCError } from '@trpc/server'

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
    const authService = new AuthService()
    const accountCreationResult =
      await authService.createAccountWithEmailAndPassword({
        email,
        password,
        name,
      })

    if (accountCreationResult.isErr()) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: accountCreationResult.error,
      })
    }
    return accountCreationResult.value
  })
