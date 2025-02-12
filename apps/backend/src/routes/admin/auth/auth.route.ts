import { t } from 'lib/trpc'
import { signInRoute } from './login.route'
import { signupRoute } from './signup.route'
export const authRouter = t.router({
  signup: signupRoute,
  signIn: signInRoute,
})
