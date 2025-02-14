import { adminSchema } from '@appflare/db/schemas'
import { z } from 'zod'

export const signupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
})
export const signupOutputSchema = z.object({
  token: z.string(),
})

export const signInInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export const signInOutputSchema = z.object({
  token: z.string(),
  user: adminSchema.select,
})
