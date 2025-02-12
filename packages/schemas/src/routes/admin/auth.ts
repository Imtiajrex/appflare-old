import { z } from 'zod'
import { userSchema } from '@appflare/db'

export const signupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
})
export const signupOutputSchema = z.object({
  token: z.string(),
  user: userSchema.select,
})

export const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export const signInOutputSchema = z.object({
  token: z.string(),
  user: userSchema.select,
})
