'use client'
import Input from '@/components/input'
import { Button } from '@tremor/react'

import { auth } from '@/lib/appflare'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Logo from '../../components/Logo'
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormSchema = z.infer<typeof formSchema>
export default function Login() {
  const { handleSubmit, control, formState } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = useMutation({
    mutationFn: async (data: FormSchema) => {
      return await auth.signInWithEmailAndPassword(data.email, data.password)
    },
    onSuccess: (result) => {
      console.log(result)
      toast.success('Login successful')

      router.push('/dashboard')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Login failed')
    },
  })
  const router = useRouter()
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center space-y-4 p-4">
        <Logo />
        <Input
          label="Email"
          placeholder="Enter your email"
          control={control}
          name={'email'}
          containerClassName="w-full"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          control={control}
          name={'password'}
          containerClassName="w-full"
          type="password"
        />
        <Link
          href="/forgot-password"
          className="text-tremor-content-subtle text-sm"
        >
          Forgot password?
        </Link>
        <Button
          className="w-full"
          onClick={handleSubmit((data) => {
            onSubmit.mutate(data)
          })}
          disabled={!formState.isValid}
          type="submit"
          loading={onSubmit.isLoading}
        >
          Login
        </Button>
        <Button
          variant="light"
          className="w-full"
          type="button"
          onClick={() => {
            router.push('/signup')
          }}
        >
          Create an account
        </Button>
      </div>
    </div>
  )
}
