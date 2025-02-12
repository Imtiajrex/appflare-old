import { AuthService } from '@appflare/services'
import { t } from 'lib/trpc'
import { signupInputSchema, signupOutputSchema } from '@appflare/schemas'

export const signupRoute = t.procedure
  .meta({
    openapi: {
      method: 'POST',
      summary: 'Sign up for an admin account',
      path: '/admin/auth/signup',
      tags: ['Admin Authentication'],
    },
  })
  .input(signupInputSchema)
  .output(signupOutputSchema)
  .mutation(async ({ input }) => {
    const { email, password, name } = input
    // create user
    const authService = new AuthService()
    const { user, token } = await authService.createAccountWithEmailAndPassword(
      {
        email,
        password,
        name,
      },
    )
    return {
      user,
      token,
    }
  })
