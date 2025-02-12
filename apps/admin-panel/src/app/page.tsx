'use client'
import Input from '@/components/input'
import { Button } from '@tremor/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormSchema = z.infer<typeof formSchema>
export default function Home() {
  const { handleSubmit, control } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-lg space-y-4 p-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          control={control}
          name={'email'}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          control={control}
          name={'password'}
        />
        <Button>Login</Button>
      </div>
    </div>
  )
}
